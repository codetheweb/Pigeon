<?php
  require "db.php";
  require "grip.php";
  
  //Upload config file
  if ($_FILES) {
    $fileName = $_FILES["file"]["name"];
    
    move_uploaded_file($_FILES["file"]["tmp_name"], "/grip-config/" . $fileName);
    
    startGRIP($fileName); //Start GRIP with new config
    writeToFile("running", $fileName); //Write status to file
    
    echo "200";
  }
  
  if ($_POST) {
    if ($_POST["list"]) {
      $files = scandir("/grip-config");
      array_splice($files, 0, 2); //Remove the first 2 'files' - . and ..
      
      $startup = readFromFile("startup");
      $running = readFromFile("running");
      
      $filesMod;
      $i = 0;
      foreach ($files as $file) {
        $filesMod[$i] = array("name" => $file);
        
        if ($file == $startup) {
          $filesMod[$i]["startup"] = true;
        }
        
        if ($file == $running) {
          $filesMod[$i]["running"] = true;
        }
        
        $i ++;
      }
      
      $filesMod = json_encode($filesMod);
      
      echo $filesMod;
    }
    
    if ($_POST["start"]) {
      $configFile = $_POST["start"];
      startGRIP($configFile);
      
      echo "200";
    }
    
    if ($_POST["stop"]) {
      $configFile = $_POST["stop"];
      stopGRIP($configFile);
      
      echo "200";
    }
    
    if ($_POST["delete"]) {
      $configFile = $_POST["delete"];
      deleteConfig($configFile);
      
      echo "200";
    }
    
    if ($_POST["addToStartup"]) {
      $configFile = $_POST["addToStartup"];
      addToStartup($configFile);
      
      echo "200";
    }
    
    if ($_POST["removeFromStartup"]) {
      $configFile = $_POST["removeFromStartup"];
      removeFromStartup($configFile);
      
      echo "200";
    }
  }
?>