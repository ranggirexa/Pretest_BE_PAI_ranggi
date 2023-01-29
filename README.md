# Pretest_BE_PAI_ranggi

Database yang digunakan: postgreSQL

Backend: NodeJS

Frontend: ReactJS

========================================================

**HOW TO RUN**

1. BACKEND
1.1 buat database di local dengan nama 'pandawa_field'

1.2 sesuaikan konfigurasi database dengan yang ada di folder 'config/database.js' dengan urutan ('nama database', 'username', 'password')

1.3 install dependencies dengan command 'npm i'

1.4 jalankan sistem dengan perintah 'npm run dev'

1.5 sistem akan berjalan pada port 5000
 
2. FRONTEND
2.1 install dependencies dengan comand npm i -f

2.2 jalankan sistem dengan perintah 'npm start'

2.3 sistem akan terbuka otomatis pada jendela browser dengan url localhost:3000
  
========================================================

**Catatan Tambahan**

jika mengalami error seperti :

** 'Access to XMLHttpRequest at 'http://localhost:5000/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control'**

untuk pengguna macos bisa eksekusi syntax berikut :

_open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security_

untuk lebih lengkapnya bisa dilihat pada tautan berikut :

https://stackoverflow.com/questions/28206680/using-group-by-and-joins-in-sequelize

