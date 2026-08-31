export const dynamic = 'force-dynamic';

export default function ForbiddenPage() {
  return (
    <main className="admin-denied">
      <img src="/logo.png" alt="FMO Wedding Specialist" />
      <span>Admin access only</span>
      <h1>Akun ini belum terdaftar sebagai Admin.</h1>
      <p>Minta pemilik website menambahkan email akun ini ke daftar Admin FMO.</p>
      <a href="/signout-with-chatgpt?return_to=/admin" target="_top">Masuk dengan akun lain</a>
    </main>
  );
}
