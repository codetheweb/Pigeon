$(document).ready(function() {
  //Generate dropdown
  function generateDropdown(id, statusText, startupText) {
    return "<a class='dropdown-button btn' href='#' data-activates='" + id + "'><i class='material-icons'>settings</i></a><ul id='" + id + "' class='dropdown-content'><li><a class='action'>" + statusText + "</a></li><li><a href='#!'>Delete</a></li><li class='divider'></li><li><a href='#!'>" + startupText + "</a></li></ul>";
  }
  
  //File listing
  function updateFileList() {
    $.post("php/helper.php", {list: "yes"}, function (response) {
        var files = JSON.parse(response);
        
        $("table > tr").remove();
        
        var dropdownHTML = "";
        
        files.forEach(function(file) {
          var status = "On Disk";
          var escapedName = btoa(file.name); //Encode filename to base 64 so we don't have to mess with spaces, quotes, etc
          escapedName = escapedName.slice(0, -1); //Slice off standard '=' on base 64 strings. Otherwise, the browser gets confused.
          
          dropdownHTML = generateDropdown(escapedName, "Start", "Add to Startup"); //Default dropdown
          
          if (file.running == true && file.startup == true) {
            dropdownHTML = generateDropdown(escapedName, "Stop", "Remove from Startup");
            status = "Running, Startup";
          }
          else if (file.running == true) {
            dropdownHTML = generateDropdown(escapedName, "Stop", "Add to Startup");
            status = "Running";
          }
          else if (file.startup == true) {
            dropdownHTML = generateDropdown(escapedName, "Start", "Remove from Startup");
            status = "Startup";
          }
          
          $("table thead").after("<tr><td>" + file.name + "</td><td>" + status + "</td><td>" + dropdownHTML + "</td></tr>"); //Inject created table row
        });
        
        $('.dropdown-button').dropdown({ //Initiate created dropdowns
          inDuration: 300,
          outDuration: 225,
          constrain_width: false, // Does not change width of dropdown to that of the activator
          hover: true, // Activate on hover
          gutter: 0, // Spacing from edge
          belowOrigin: true, // Displays dropdown below the button
          alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });
        
        //Start/stop config file
        $(".action").click(function() {
          var configName = $(this.closest("ul")).prop("id");
          configName = configName + "="; //Add '=' back in to base 64 string that we previously removed
          configName = atob(configName);
          
          var text = $(this).text();
          
          if (text == "Start") {
            var data = {start: configName};
          }
          else if (text == "Stop") {
            var data = {stop: configName};
          }
          
          $.post("php/helper.php", data, function(response) {
            if (response == "200") {
              updateFileList();
            }
            else {
              Materialize.toast("Something went wrong!", 2000, "red");
            }
          });
        });
    });
  }
  
  updateFileList(); //Init files in table
  
  //Upload file
  $(".upload-file").change(function() {
    var file = $(".upload-file").prop("files")[0];
    var data = new FormData();
    
    data.append("file", file);
    
    $.ajax({
      url: "php/helper.php",
      dataType: "text",
      cache: false,
      contentType: false,
      processData: false,
      data: data,
      type: "post",
      success: function(response) {
        if (response == "200") {
          updateFileList();
          Materialize.toast("File was uploaded!", 2000, "green");
        }
        else {
          Materialize.toast("Something went wrong!", 2000, "red");
        }
      }
    });
  });
});
