<?php
$activitiesFile = 'activities.json';

// Log errors to a file
ini_set('log_errors', 1);
ini_set('error_log', 'error.log');

// Read the current activities
$activities = json_decode(file_get_contents($activitiesFile), true) ?? [];

// Get the new activity data from the request
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!empty($data['title']) && !empty($data['date']) && !empty($data['description']) && !empty($data['image'])) {
    $activities[] = $data;

    if (file_put_contents($activitiesFile, json_encode($activities, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true]);
    } else {
        error_log("Error: Unable to write to $activitiesFile");
        echo json_encode(['success' => false, 'message' => 'Unable to save the activity.']);
    }
} else {
    error_log('Error: Incomplete activity data - ' . json_encode($data));
    echo json_encode(['success' => false, 'message' => 'Incomplete activity data.']);
}
