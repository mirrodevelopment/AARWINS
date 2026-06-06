Add-Type -AssemblyName System.Drawing
$imagePath = 'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\images\collection-pg-sec.png'
$bmp = New-Object System.Drawing.Bitmap($imagePath)
for ($y = 0; $y -lt $bmp.Height; $y += 100) {
    $pixel = $bmp.GetPixel($bmp.Width - 1, $y)
    Write-Output "Pixel at ($($bmp.Width - 1), $y): R=$($pixel.R), G=$($pixel.G), B=$($pixel.B)"
}
# Also check last pixel
$pixel = $bmp.GetPixel($bmp.Width - 1, $bmp.Height - 1)
Write-Output "Pixel at ($($bmp.Width - 1), $($bmp.Height - 1)): R=$($pixel.R), G=$($pixel.G), B=$($pixel.B)"
$bmp.Dispose()
