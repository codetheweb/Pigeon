<?php
  function writeToFile($name, $contents) {
    $handle = fopen("db/" . $name, "w+");
    fwrite($handle, $contents);
    fclose($handle);
  }
  
  function readFromFile($name) {
    return file_get_contents("db/" . $name);
  }
?>