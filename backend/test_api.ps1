$body = @{ email = "student@edtech.com"; password = "password123" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $loginResponse.accessToken
Write-Host "✅ Token obtained: $token"

$headers = @{ Authorization = "Bearer $token" }

# Test Dashboard
try {
    $dashboard = Invoke-RestMethod -Uri "http://localhost:5000/api/courses/dashboard" -Method Get -Headers $headers
    Write-Host "✅ Dashboard Working: $($dashboard.stats.activeCourses) active courses found."
} catch {
    Write-Host "❌ Dashboard Error: $_"
}

# Test Courses (Trending)
$courses = Invoke-RestMethod -Uri "http://localhost:5000/api/courses" -Method Get
$trending = $courses | Where-Object { $_.isTrending -eq $true }
if ($trending.Count -gt 0) {
    Write-Host "✅ Trending Courses Served: $($trending.Count) found."
} else {
    Write-Host "⚠️ No Trending Courses found. Check seeding."
}

# Test Course Details
if ($courses.Count -gt 0) {
    try {
        $id = $courses[0].id
        $details = Invoke-RestMethod -Uri "http://localhost:5000/api/courses/$id" -Method Get -Headers $headers
        Write-Host "✅ Course Details Working: $($details.title)"
    } catch {
        Write-Host "❌ Course Details Error: $_"
    }
}
