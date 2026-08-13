import express from 'express';
import { query } from '../lib/db.js';

const router = express.Router();

// GET /api/departments — departments with nested divisions and sectors
router.get('/', async (req, res) => {
    try {
        const depsResult = await query(
            `SELECT id, name_ru, name_kk, director_full_name, director_title_ru, director_title_kk
             FROM departments ORDER BY id ASC`
        );

        const divsResult = await query(
            `SELECT id, department_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk
             FROM divisions ORDER BY id ASC`
        );

        const sectsResult = await query(
            `SELECT id, division_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk
             FROM sectors ORDER BY id ASC`
        );

        const sectors = sectsResult.rows;
        const divisions = divsResult.rows.map(div => ({
            ...div,
            sectors: sectors.filter(s => s.division_id === div.id)
        }));

        const departments = depsResult.rows.map(dep => ({
            ...dep,
            divisions: divisions.filter(d => d.department_id === dep.id)
        }));

        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: 'Failed to fetch departments' });
    }
});

// GET /api/departments/:id — single department with nested divisions and sectors
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const depResult = await query(
            `SELECT id, name_ru, name_kk, director_full_name, director_title_ru, director_title_kk
             FROM departments WHERE id = $1`, [id]
        );

        if (depResult.rows.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const dep = depResult.rows[0];

        const divsResult = await query(
            `SELECT id, department_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk
             FROM divisions WHERE department_id = $1 ORDER BY id ASC`, [id]
        );

        const divIds = divsResult.rows.map(d => d.id);
        let sectors = [];
        if (divIds.length > 0) {
            const sectsResult = await query(
                `SELECT id, division_id, name_ru, name_kk, head_full_name, head_title_ru, head_title_kk
                 FROM sectors WHERE division_id = ANY($1) ORDER BY id ASC`, [divIds]
            );
            sectors = sectsResult.rows;
        }

        const divisions = divsResult.rows.map(div => ({
            ...div,
            sectors: sectors.filter(s => s.division_id === div.id)
        }));

        res.json({ ...dep, divisions });
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ message: 'Failed to fetch department' });
    }
});

export default router;
