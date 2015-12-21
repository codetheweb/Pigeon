$(document).ready(function() {
  //Generate dropdown
  function generateDropdown(name, statusText, startupText) {
    var id = name.hashCode();
    
    return "<a class='btn waves-effect amber accent-4 dropdown-button' href='#' data-activates='" + id + "'><i class='material-icons'>settings</i></a><ul id='" + id + "' class='dropdown-content' data-filename='" + name + "'><li><a class='action'>" + statusText + "</a></li><li><a class='delete'>Delete</a></li><li class='divider'></li><li><a class='startup'>" + startupText + "</a></li></ul>";
  }
  
  //File listing
  function updateFileList() {
    $.post("php/helper.php", {list: "yes"}, function (response) {
        var files = JSON.parse(response);
        
        $("table > tr").remove();
        
        var dropdownHTML = "";
        
        files.forEach(function(file) {
          var status = "On Disk";
          var filename = file.name;
          
          dropdownHTML = generateDropdown(filename, "Start", "Add to Startup"); //Default dropdown
          
          if (file.running == true && file.startup == true) {
            dropdownHTML = generateDropdown(filename, "Stop", "Remove from Startup");
            status = "Running, Startup";
          }
          else if (file.running == true) {
            dropdownHTML = generateDropdown(filename, "Stop", "Add to Startup");
            status = "Running";
          }
          else if (file.startup == true) {
            dropdownHTML = generateDropdown(filename, "Start", "Remove from Startup");
            status = "Startup";
          }
          
          $("table thead").after("<tr><td>" + filename + "</td><td>" + status + "</td><td>" + dropdownHTML + "</td></tr>"); //Inject created table row
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
        $(".action, .delete, .startup").click(function() {
          var configName = $(this.closest("ul")).data("filename");
          console.log(configName);
          
          var text = $(this).text();
          
          if (text == "Start") {
            var data = {start: configName};
          }
          else if (text == "Stop") {
            var data = {stop: configName};
          }
          else if (text == "Delete") {
            var data = {delete: configName};
          }
          else if (text == "Add to Startup") {
            var data = {addToStartup: configName};
          }
          else if (text == "Remove from Startup") {
            var data = {removeFromStartup: configName};
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
  
  //Dark theme
  function darkMode(change) {
    if (Cookies.get("theme") == "dark") {
      if (change) {
        $("body").removeClass("darkmode");
        Cookies.set("theme", "light");
      }
      else {
        $("body").addClass("darkmode");
        Cookies.set("theme", "dark");
      }
    }
    else {
      if (change) {
        $("body").addClass("darkmode");
        Cookies.set("theme", "dark");
      }
      else {
        $("body").removeClass("darkmode");
        Cookies.set("theme", "light");
      }
    }
  }
  
  darkMode(); //Init darkmode if cookie
  
  $(".invert").click(function() {
    darkMode(true);
  });
});

//Simple hashing function - thanks [SO](http://stackoverflow.com/a/7616484)!
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
