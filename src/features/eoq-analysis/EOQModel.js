export default class EOQModel {
  // Jika nanti mau menyimpan history perhitungan ke DB, logic API taruh di sini
  static saveCalculationHistory(data) {
    console.log("Simulasi simpan history:", data);
    return Promise.resolve(true);
  }
}