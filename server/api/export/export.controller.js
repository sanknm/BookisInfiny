import path from 'path';

export async function template(req, res) {
     const filePath = path.join(__dirname, '../../template/export/Bookis_template_full.xlsx');
     res.download(filePath);
}