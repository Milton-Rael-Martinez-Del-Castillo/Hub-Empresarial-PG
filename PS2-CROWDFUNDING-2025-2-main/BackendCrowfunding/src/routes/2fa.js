import express from "express";
import { pool } from "../db.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

const router = express.Router();

// GENERAR EL SECRETO Y EL QR
router.post("/generate", async (req, res) => {
  const { userId } = req.body;

  const secret = speakeasy.generateSecret({
    name: `IncuvaLab (${userId})`,
    length: 20,
  });

  // Guardar el secreto temporalmente en la BD
  await pool.query("UPDATE Usuario SET CodigoSecreto = ? WHERE IdUser = ?", [
    secret.base32,
    userId,
  ]);

  // Generar QR
  const qrImage = await qrcode.toDataURL(secret.otpauth_url);

  res.json({
    secret: secret.base32,
    qrImage,
  });
});
//VERIFICAR EL CÓDIGO INGRESADO POR EL USUARIO
router.post("/verify", async (req, res) => {
  const { userId, token } = req.body;

  const [rows] = await pool.query(
    "SELECT CodigoSecreto FROM Usuario WHERE IdUser = ?",
    [userId]
  );

  if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });

  const secret = rows[0].CodigoSecreto;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (verified) {
    await pool.query(
      "UPDATE Usuario SET DobleFactorActivo = 1 WHERE IdUser = ?",
      [userId]
    );
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Código incorrecto" });
  }
});
//DESACTIVAR 2FA
router.post("/disable", async (req, res) => {
  const { userId } = req.body;

  await pool.query(
    "UPDATE Usuario SET DobleFactorActivo = 0, CodigoSecreto = NULL WHERE IdUser = ?",
    [userId]
  );

  res.json({ success: true, message: "Doble factor desactivado" });
});
//CONSULTAR ESTADO DE 2FA
router.get("/status/:userId", async (req, res) => {
  const { userId } = req.params;

  const [rows] = await pool.query(
    "SELECT DobleFactorActivo FROM Usuario WHERE IdUser = ?",
    [userId]
  );

  if (!rows.length) return res.status(404).json({ error: "Usuario no encontrado" });

  res.json({ isActive: Boolean(rows[0].DobleFactorActivo) });
});

export default router;
