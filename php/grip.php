<?php
  //This code is currently non-functional as GRIP does not yet support a CLI
  
  function startGRIP($configFile) {
    stopGRIP();
    //exec("grip /grip-config/" + $configFile);
    writeToFile("running", $configFile);
  }
  
  function stopGRIP() {
    //exec("killall grip");
    writeToFile("running", "");
  }
  
  function deleteConfig($configFile) {
    exec("rm /grip-config/" + $configFile);
  }
  
  function addToStartup($configFile) {
    //exec("echo grip /grip-config/" + $configFile + "> startup.init");
    writeToFile("startup", $configFile);
    stopGRIP();
    startGRIP($configFile);
  }
  
  function removeFromStartup($configFile) {
    //exec(rm startup.init);
    writeToFile("startup", "");
    stopGRIP();
  }
?>