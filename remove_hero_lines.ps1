$file = 'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\collections.html'
$lines = Get-Content $file
$out = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    $lineNum = $i + 1
    if ($lineNum -lt 1319 -or $lineNum -gt 1420) {
        $out += $lines[$i]
    }
}
$out | Set-Content $file -Encoding UTF8
Write-Host "Done. Removed lines 1319-1420. New line count: $($out.Count)"
