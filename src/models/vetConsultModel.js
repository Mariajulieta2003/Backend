import { pool } from "../config/db.js";

export const insertVetConsult = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO vet_consults 
    (user_id, pet_id, plan, urgency, reason, symptoms, contact_method)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.pet_id,
      data.plan,
      data.urgency,
      data.reason,
      data.symptoms,
      data.contact_method,
    ]
  );
  return result.insertId;
};

export const selectUserVetConsults = async (user_id) => {
  const [rows] = await pool.query(
    `SELECT vc.*, p.name AS pet_name, p.species
     FROM vet_consults vc
     LEFT JOIN pets p ON p.id = vc.pet_id
     WHERE vc.user_id = ?
     ORDER BY vc.created_at DESC`,
    [user_id]
  );
  return rows;
};

export const selectVetQueue = async () => {
  const [rows] = await pool.query(
    `SELECT vc.*, u.full_name AS user_name, p.name AS pet_name, p.species
     FROM vet_consults vc
     JOIN users u ON u.id = vc.user_id
     LEFT JOIN pets p ON p.id = vc.pet_id
     ORDER BY vc.created_at ASC`
  );
  return rows;
};

export const updateStatus = async (id, status) => {
  await pool.query(
    `UPDATE vet_consults SET status = ? WHERE id = ?`,
    [status, id]
  );
};
