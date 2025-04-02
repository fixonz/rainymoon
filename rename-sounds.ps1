$sourceDir = "public/sounds/newSounds"
$destDir = "public/sounds/soundsLibrary"

# Create the destination directory if it doesn't exist
New-Item -ItemType Directory -Force -Path $destDir

# Get all .flac files
Get-ChildItem $sourceDir -Filter "*.flac" | ForEach-Object {
    # First replace spaces with dashes, then replace multiple dashes with a single dash
    $newName = $_.Name -replace ' ', '-'
    $newName = $newName -replace '-+', '-'
    Copy-Item $_.FullName -Destination (Join-Path $destDir $newName)
}

# Copy the playlist file if it exists
if (Test-Path "$sourceDir/*.m3u8") {
    Copy-Item "$sourceDir/*.m3u8" -Destination $destDir
}

Write-Host "Files copied and renamed successfully!" 