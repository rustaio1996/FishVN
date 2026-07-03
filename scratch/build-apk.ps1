$ErrorActionPreference = "Stop"

# Set up environment variables
$env:JAVA_HOME = "C:\Program Files (x86)\Android\openjdk\jdk-17.0.14"
$env:ANDROID_HOME = "C:\Users\ADMIN\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

Write-Host "=== BẮT ĐẦU DỰNG APK ==="

# 1. Tạo thư mục web sạch
$webDir = "dist/web"
if (Test-Path $webDir) {
    Remove-Item -Path $webDir -Recurse -Force
}
New-Item -ItemType Directory -Path $webDir

# Copy các file và thư mục cần thiết
Copy-Item -Path "NguOngBatOn.html" -Destination "$webDir/"
Copy-Item -Path "index.html" -Destination "$webDir/"
Copy-Item -Path "assets" -Destination "$webDir/assets" -Recurse
Copy-Item -Path "css" -Destination "$webDir/css" -Recurse
Copy-Item -Path "js" -Destination "$webDir/js" -Recurse

# 2. Khởi tạo Capacitor nếu chưa có config
if (-not (Test-Path "capacitor.config.json")) {
    Write-Host "Khởi tạo Capacitor config..."
    npx cap init "Ngư Ông Bất Ổn" "com.nguongbaton.game" --web-dir=$webDir
}

# 3. Tạo thư mục android nếu chưa có
if (-not (Test-Path "android")) {
    Write-Host "Thêm platform Android..."
    npx cap add android
}

# 4. Sync assets sang project Android
Write-Host "Đồng bộ assets..."
npx cap sync android

# 5. Build APK bằng Gradle
Write-Host "Biên dịch APK bằng Gradle..."
cd android
.\gradlew.bat assembleDebug

# 6. Sao chép APK đầu ra vào thư mục dist
Write-Host "Sao chép APK đầu ra..."
cd ..
if (-not (Test-Path "dist")) {
    New-Item -ItemType Directory -Path "dist"
}
$version = (Get-Content package.json -Raw | ConvertFrom-Json).version
Copy-Item -Path "android/app/build/outputs/apk/debug/app-debug.apk" -Destination "dist/Ngư Ông Bất Ổn $version.apk" -Force

Write-Host "=== DỰNG APK THÀNH CÔNG! ==="
