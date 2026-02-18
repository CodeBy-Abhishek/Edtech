function Test-Api {
    param($title, $Url, $Method = "Get", $Headers = @{}, $Body = $null)
    try {
        if ($Method -eq "Post") {
            $json = $Body | ConvertTo-Json
            $res = Invoke-RestMethod -Uri $Url -Method Post -Headers $Headers -Body $json -ContentType "application/json"
        }
        else {
            $res = Invoke-RestMethod -Uri $Url -Method Get -Headers $Headers
        }
        Write-Host "OK - $title"
        return $res
    }
    catch {
        Write-Host "ERR - $title"
        return $null
    }
}

Write-Host "--- STARTING TESTS ---"

# Admin
$admin = Test-Api "Admin Login" "http://localhost:5000/api/auth/login" "Post" @{} @{ email = "admin@edtech.com"; password = "password123" }
if ($admin) {
    $h = @{ Authorization = "Bearer $($admin.accessToken)" }
    Test-Api "Admin Stats" "http://localhost:5000/api/admin/stats" "Get" $h
    Test-Api "Inst Stats" "http://localhost:5000/api/instructor/stats" "Get" $h
    Test-Api "Student Dash" "http://localhost:5000/api/courses/dashboard" "Get" $h
    
    # New Feature Tests
    Test-Api "Fetch Notes" "http://localhost:5000/api/notes" "Get" $h
    $l = Test-Api "Fetch Labs" "http://localhost:5000/api/labs/my-labs" "Get" $h
    
    if ($l -and $l.Count -gt 0) {
        $labId = $l[0].id
        Test-Api "Get Lab $labId" "http://localhost:5000/api/labs/$labId" "Get" $h
    }
}

Write-Host "--- TESTS COMPLETE ---"
