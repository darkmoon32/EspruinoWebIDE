/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 
 ------------------------------------------------------------------
  Blockly blocks for Espruino
 ------------------------------------------------------------------
**/    

// --------------------------------- Blockly init code - see /js/core/editorBlockly.js
window.onload = function() {
  Blockly.inject(document.body,{path: '', toolbox: document.getElementById('toolbox')});
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, document.getElementById('blocklyInitial')); 
  window.parent.blocklyLoaded(Blockly, window); // see core/editorBlockly.js
};
// When we have JSON from the board, use it to
// update our list of available pins
Blockly.setBoardJSON = function(info) {
  console.log("Blockly.setBoardJSON ", info);
  if (!("pins" in info)) return;
  if (!("devices" in info)) return;
  PINS = [];
  var i,s; 
  for (i=1;i<8;i++) {
    s = "LED"+i;
    if (s in info.devices) PINS.push([s,s]);
  }
  for (i=1;i<8;i++) {
    s = "BTN"+i;
    if (s in info.devices) PINS.push([s,s]);
  }
  for (i in info.pins)
    PINS.push([info.pins[i].name, info.pins[i].name]);
  
  
};
// ---------------------------------

var ESPRUINO_COL = 190;

var PORTS = ["A","B","C"];
var PINS = [
      ["LED1", 'LED1'],
      ["LED2", 'LED2'],
      ["LED3", 'LED3'],
      ["BTN1", 'BTN1']];
for (var p in PORTS)
  for (var i=0;i<16;i++) {
    var pinname = PORTS[p]+i;
    PINS.push([pinname,pinname]);
  }

Blockly.Blocks.espruino_timeout = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField('wait');
      this.appendDummyInput()
          .appendField("seconds");
      this.appendStatementInput('DO')
           .appendField('do');

    this.setOutput(true,null);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Waits for a certain period before running code');
  }
};

Blockly.Blocks.espruino_clear_timeout = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('TIMEOUT')
            .appendField('Clear timeout ');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Clear the specified timeout');
    }
};

Blockly.Blocks.espruino_interval = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField('every');
      this.appendDummyInput()
          .appendField("seconds");
      this.appendStatementInput('DO')
           .appendField('do');
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Runs code repeatedly, every so many seconds');
  }
};

Blockly.Blocks.espruino_clear_interval = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('INTERVAL')
            .appendField('Clear interval ');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Clear the specified interval');
    }
};

Blockly.Blocks.espruino_change_interval = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('INTERVAL')
            .appendField('Change interval ');
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField('seconds');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Change the specified interval');
    }
};

Blockly.Blocks.espruino_pin = {
//      category: 'Espruino',
  init: function() {
    
    var start = 0;
    var incrementStep = 10;
    var originalPin = undefined;
    var listGen = function() {
      originalPin = this.value_;
      var list = PINS.slice(start, start+incrementStep);
      if (start>0) list.unshift(['Back...', 'Back']);
      if (start+incrementStep<PINS.length) list.push(['More...', 'More']);        
      return list;
    };    
    
    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){
      var ret = undefined;
      
      if (selection == "More" || selection == "Back") {  
        if (selection == "More")
          start += incrementStep;
        else
          start -= incrementStep;
        
        var t = this;
        setTimeout(function(){t.showEditor_();},1);

        return originalPin;
      }      
    });
    
    this.setColour(ESPRUINO_COL);
    this.setOutput(true, 'Pin');
    this.appendDummyInput().appendField(pinSelector, 'PIN');
    this.setTooltip('The Name of a Pin');
  },
};


Blockly.Blocks.espruino_watch = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField('watch');
      this.appendDummyInput()
           .appendField(new Blockly.FieldDropdown(this.EDGES), 'EDGE').appendField('edge');
      this.appendValueInput('DEBOUNCE')
          .setCheck('Number')
          .appendField('debounce');
      this.appendStatementInput('DO')
           .appendField('do');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Runs code when an input changes');
  },
EDGES: [
["both", 'both'],
["rising", 'rising'],
["falling", 'falling']]
};


Blockly.Blocks.espruino_getTime = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField('Time');
      this.setOutput(true, 'Number');
      this.setColour(230/*Number*/);
      this.setInputsInline(true);
      this.setTooltip('Read the current time in seconds');
    }
  };

Blockly.Blocks.espruino_servo = {
  category: 'Modules',
  init: function() {
      this.appendValueInput('PIN')
        .setCheck('Pin')
        .appendField('Connect servo to ');
//    this.setPreviousStatement(true);
//    this.setNextStatement(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Initialize servo');
  }
};
Blockly.Blocks.espruino_servoMove = {
  category: 'Modules',
  init: function() {
      this.appendValueInput('SRV')
          .appendField('Move servo');
      this.appendValueInput('POS')
          .setCheck('Number')
          .appendField('to position');
      this.appendValueInput('DUR')
          .setCheck('Number')
          .appendField('miliseconds');
      this.appendStatementInput('DO')
           .appendField('do');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Move servo');
  }
};
	
/*EBR00043L block*/
Blockly.Blocks.espruino_EBR00043L = {
  category: 'Modules',
  init: function() {
      this.appendValueInput('S1')
          .setCheck('Pin')
          .appendField('Get line finder value connected at S1');
      this.appendValueInput('S2')
          .setCheck('Pin')
          .appendField('S2');
      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Line finder');
  }
};	

/*
 * Block for HC-SR04 sensor connection
 */
Blockly.Blocks.HCSR04_def = {
	category : 'Modules',
	init : function()
	{
		this.appendValueInput('PIN_trig').setCheck('Pin').appendField('connect HC-SR04: trig Pin');
		this.appendValueInput('PIN_echo').setCheck('Pin').appendField('echo Pin');
		this.appendDummyInput().appendField('callback').appendField(new Blockly.FieldTextArea("HCSRcb"),"DO");
		this.setOutput(true, null);
		this.setColour(ESPRUINO_COL);
		this.setInputsInline(true);
		this.setTooltip('Defines connection for HC-SR04 sensor. Callback clbk(distance)');
	}
};

/*
 * Block for HC-SR04 sensor read
 */
Blockly.Blocks.HCSR04_read = {
	category : 'Modules',
	init : function()
	{
		this.appendValueInput('sensor').appendField('read HC-SR04');

		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setColour(ESPRUINO_COL);
		this.setInputsInline(true);
		this.setTooltip('Read distance from HC-SR04 sensor in cm');
	}
};
// -----------------------------------------------------------------------------------

/*
 * Block for YL-64
 */
Blockly.Blocks.YL64_def = {
	category : 'Modules',
	init : function()
	{
		this.appendValueInput('S0').setCheck('Pin').appendField('Connect YL-64: S0');
		this.appendValueInput('S1').setCheck('Pin').appendField('S1');
		this.appendValueInput('S2').setCheck('Pin').appendField('S2');
		this.appendValueInput('S3').setCheck('Pin').appendField('S3');
		this.appendValueInput('OUT').setCheck('Pin').appendField('OUT');

		this.setOutput(true, null);
		this.setColour(ESPRUINO_COL);
		this.setInputsInline(false);
		this.setTooltip('Defines connection for YL-64 sensor');
	}
};

Blockly.Blocks.YL64_read = {
	category : 'Modules',
	init : function()
	{
		this.appendValueInput('sensor').appendField('read color from YL-64');

		this.setOutput(true, null);
		this.setColour(ESPRUINO_COL);
		this.setInputsInline(true);
		this.setTooltip('Read detected color');
	}
};
// -----------------------------------------------------------------------------------
Blockly.Blocks.espruino_digitalWrite = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField('digitalWrite Pin');
      this.appendValueInput('VAL')
          .setCheck(['Number','Boolean'])
          .appendField('Value');

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Writes a Digital Value to a Pin');
  }
};
Blockly.Blocks.espruino_digitalPulse = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField('digitalPulse Pin');
        this.appendValueInput('VAL')
            .setCheck(['Boolean']);
        this.appendValueInput('TIME')
            .setCheck(['Number'])
            .appendField('Milliseconds');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Pulses a pin for the given number of milliseconds');
    }
  };
Blockly.Blocks.espruino_digitalRead = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField('digitalRead Pin');

    this.setOutput(true, 'Boolean');
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip('Read a Digital Value from a Pin');
  }
};

Blockly.Blocks.espruino_analogWrite = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField('analogWrite Pin');
        this.appendValueInput('VAL')
            .setCheck(['Number','Boolean'])
            .appendField('Value');
        this.appendValueInput('FREQ')
            .setCheck('Number')
            .appendField('Frequency');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Writes an Analog Value to a Pin');
    }
  };
Blockly.Blocks.espruino_analogRead = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField('analogRead Pin');

      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Read an Analog Value from a Pin');
    }
  };

Blockly.Blocks.espruino_code = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldTextArea("// Enter JavaScript Code Here"),"CODE");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Executes the given JavaScript code');
    }
  };

/*Wifi*/
/*Wifi connect esp8266*/
Blockly.Blocks.esp8266_connect = {
    category: 'Wifi',
    init: function() {
        var dropdown = new Blockly.FieldDropdown([['serial1', 'Serial1'], ['serial2', 'Serial2'], ['serial3', 'Serial3'], ['serial4', 'Serial4'], ['serial5', 'Serial5']]);
        this.appendDummyInput().appendField("Serial")
           .appendField(dropdown, 'SER').appendField('connect to');
        this.appendValueInput('RX')
            .setCheck('Pin')
            .appendField('RX pin');
        this.appendValueInput('TX')
            .setCheck('Pin')
            .appendField('TX pin');
        this.appendValueInput('BAUD')
            .setCheck('Number')
            .appendField('with baudrate');
      this.appendStatementInput('DO').appendField('callback');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Connect ESP8266 to Espruino');
    }
  };

/*connect to SSID*/
Blockly.Blocks.connect_ssid = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput().appendField("SSID").appendField(new Blockly.FieldTextArea("SSID"),"SSID");
        this.appendDummyInput().appendField("Password").appendField(new Blockly.FieldTextArea("Password"),"PASS");
      this.appendStatementInput('DO').appendField('callback');
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Connect Espruino to network');
    }
  };

/*get IP*/
Blockly.Blocks.get_IP = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput().appendField("Get IP").appendField(new Blockly.FieldTextArea("getIPCB"),"DO");
      this.setColour(ESPRUINO_COL);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('Get IP of device. IP is stored in variable ip. ex.: cb(err,ip)');
    }
  };

/*get APs*/
Blockly.Blocks.get_APs = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput().appendField("Get APs").appendField(new Blockly.FieldTextArea("getAPsCB"),"DO");
      this.setColour(ESPRUINO_COL);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('Get APs in range. APs arestored in variable ap. ex.: cb(err,aps)');
    }
  };

/*get version*/
Blockly.Blocks.get_version = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput().appendField("Get version").appendField(new Blockly.FieldTextArea("getVersionCB"),"DO");
      this.setColour(ESPRUINO_COL);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('Get firmware version of module. version is stored in variable version. ex.: cb(err,version)');
    }
  };

/*get version*/
Blockly.Blocks.get_connected = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput().appendField("Get connected devices").appendField(new Blockly.FieldTextArea("getConnectedDevicesCB"),"DO");
      this.setColour(ESPRUINO_COL);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setInputsInline(true);
      this.setTooltip('Get list of connected devices. Devices are stored in variable devices. ex.: cb(err, devices)');
    }
  };

/*create server*/
Blockly.Blocks.create_server = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput()
            .appendField(Blockly.Msg.CREATE_SERVER_SOCKET_ONINCOMING)
            .appendField(new Blockly.FieldTextArea("onIncomingCB"),"ONINCOMING");
        this.appendValueInput('PORT')
            .setCheck('Number')
            .appendField(Blockly.Msg.CREATE_SERVER_SOCKET_PORT);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.CREATE_SERVER_SOCKET_TOOLTIP);
    }
  };

/*Bind socket's callbacks*/
Blockly.Blocks['bind_callbacks'] = {
  category: "Wifi",
  init: function() {
    this.appendDummyInput()
        .appendField("Bind socket")
        .appendField(new Blockly.FieldVariable("socket"), "VAR");
    this.appendDummyInput()
        .appendField("onData")
        .appendField(new Blockly.FieldTextInput("onDataCB"), "ONDATA");
    this.appendDummyInput()
        .appendField("onClose")
        .appendField(new Blockly.FieldTextInput("onCloseCB"), "ONCLOSE");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.BIND_SOCKET_SERVER_CALLBACKS_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.BIND_SOCKET_SERVER_CALLBACKS_HELPURL);
  }
};

/*connect server*/
Blockly.Blocks.connect_server = {
    category: 'Wifi',
    init: function() {
        this.appendDummyInput()
            .appendField('Connect to server. Host')
            .appendField(new Blockly.FieldTextArea("Host IP"),"HOST");
        this.appendValueInput('PORT')
            .setCheck('Number')
            .appendField('Port');
        this.appendDummyInput()
            .appendField('Callbacks: onData')
            .appendField(new Blockly.FieldTextArea("onDataCB"),"ONDATA");
        this.appendDummyInput()
            .appendField('onClose')
            .appendField(new Blockly.FieldTextArea("onCloseCB"),"ONCLOSE");
      this.appendStatementInput('DO').appendField('callback');
      this.setOutput(true, null);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip('Connect TCP server');
    }
  };

/*send data*/
Blockly.Blocks['send_data'] = {
  category: "Wifi",
  init: function() {
    this.appendValueInput("DATA")
        .setCheck("String")
        .appendField(Blockly.Msg.SOCKET_SEND_DATA_DATA);
    this.appendValueInput("SOCKET")
        .setCheck(null)
        .appendField(Blockly.Msg.SOCKET_SEND_DATA_SOCKET);
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox("FALSE"), "CLOSE")
        .appendField(Blockly.Msg.SOCKET_SEND_DATA_CLOSE_IT);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.SOCKET_SEND_DATA_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.SOCKET_SEND_DATA_HELPURL);
  }
};

// -----------------------------------------------------------------------------------

/* Create web server - start */
Blockly.Blocks.create_web_server = {
    category: 'Web',
    init: function() {
        this.appendDummyInput()
            .appendField('Create web server. Callback: onPageRequest')
            .appendField(new Blockly.FieldTextArea("onPageRequest"),"ONPAGEREQUEST");
        this.appendValueInput('PORT')
            .setCheck('Number')
            .appendField('listen on port');
      this.setPreviousStatement(false);
      this.setNextStatement(false);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setOutput(true, null);
      this.setTooltip('Create Web server. Callback is called when is an request. Callback requires two arguments request and response so the callback should look like onPageRequest(req, res)');
    }
  };

/* Create web server - end */
Blockly.Blocks['read_objects_property_mutator'] = {
  /**
   * Mutator block for add items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(ESPRUINO_COL);
    this.appendDummyInput()
        .appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['read_objects_property_mutator_container'] = {
	init:function(){
		this.setColour(ESPRUINO_COL);
		this.appendDummyInput().appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_CONTAINER_TITLE);
		this.appendStatementInput("STACK");
		this.setTooltip(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['read_objects_property_'] = {
  /**
   * Block for creating a string made up of any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(ESPRUINO_COL);
    this.itemCount_ = 1;
    this.appendValueInput('VAR').appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_VAR);
    this.updateShape_();
    this.setOutput(true);
    this.setInputsInline(true);
    this.setMutator(new Blockly.Mutator(['read_objects_property_mutator']));
    this.setTooltip(Blockly.Msg.READ_OBJECTS_PROPERTY_TOOLTIP);
  },
  /**
   * Create XML to represent number of text inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the text inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace,"read_objects_property_mutator_container");
//    var containerBlock = workspace.newBlock('text_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace,"read_objects_property_mutator");
//      var itemBlock = workspace.newBlock('text_create_join_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('KEY' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('KEY' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('KEY' + i)) {
        this.removeInput('KEY' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_NO_KEY)
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('KEY' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.READ_OBJECTS_PROPERTY);
        }
      }
    }
  }
};

Blockly.Blocks['url_parse'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.URL_PARSE_URL_TEXT)
        .appendField(new Blockly.FieldVariable("item"), "URL");
    this.appendValueInput("PARSEQUERY")
        .setCheck("Boolean")
        .appendField(Blockly.Msg.URL_PARSE_QUERY_TEXT);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.URL_PARSE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.URL_PARSE_HELPURL);
  }
}

Blockly.Blocks['httpsrs_end'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.HTTPSRS_END_TEXT)
        .appendField(new Blockly.FieldVariable("res"), "VAR");
    this.appendValueInput("DATA")
        .setCheck("String")
        .appendField(Blockly.Msg.HTTPSRS_END_DATA_TEXT);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.HTTPSRS_END_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.HTTPSRS_END_HELPURL);
  }
};

Blockly.Blocks['httpsrs_writehead'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.HTTPSRS_WRITEHEAD_TEXT)
        .appendField(new Blockly.FieldVariable("res"), "VAR");
    this.appendValueInput("CODE")
        .setCheck("Number")
        .appendField(Blockly.Msg.HTTPSRS_WRITEHEAD_CODE);
    this.appendValueInput("KEYS")
        .setCheck(["String", "Array"])
        .appendField(Blockly.Msg.HTTPSRS_WRITEHEAD_KEYS);
    this.appendValueInput("VALUES")
        .setCheck(["String", "Array"])
        .appendField(Blockly.Msg.HTTPSRS_WRITEHEAD_VALUES);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.HTTPSRS_WRITEHEAD_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.HTTPSRS_WRITEHEAD_HELPURL);
  }
};

Blockly.Blocks['text_charCodeAt'] = {
  init: function() {
    this.appendValueInput("STR")
        .setCheck("String")
        .appendField(Blockly.Msg.TEXT_CHAR_CODE_AT_STR);
    this.appendValueInput("POS")
        .setCheck("Number")
        .appendField(Blockly.Msg.TEXT_CHAR_CODE_AT_POS);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.TEXT_CHAR_CODE_AT_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.TEXT_CHAR_CODE_AT_HELPURL);
  }
};

Blockly.Blocks['text_fromcharcode'] = {
  init: function() {
    this.appendValueInput("CHARCODE")
        .setCheck("Number")
        .appendField(Blockly.Msg.TEXT_CHAR_FROM_CHARCODE_CHARCODE);
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.TEXT_CHAR_FROM_CHARCODE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.TEXT_CHAR_FROM_CHARCODE_HELPURL);
  }
};

/* callbacks */
Blockly.JavaScript['text_fromcharcode'] = function(block) {
  var value_charcode = Blockly.JavaScript.valueToCode(block, 'CHARCODE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'String.fromCharCode(' + value_charcode + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['text_charCodeAt'] = function(block) {
  var value_str = Blockly.JavaScript.valueToCode(block, 'STR', Blockly.JavaScript.ORDER_ATOMIC);
  var value_pos = Blockly.JavaScript.valueToCode(block, 'POS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_str + ".charCodeAt(" + ( value_pos - 1 ) + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['httpsrs_writehead'] = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_code = Blockly.JavaScript.valueToCode(block, 'CODE', Blockly.JavaScript.ORDER_ATOMIC);
  var value_keys = Blockly.JavaScript.valueToCode(block, 'KEYS', Blockly.JavaScript.ORDER_ATOMIC);
  var value_values = Blockly.JavaScript.valueToCode(block, 'VALUES', Blockly.JavaScript.ORDER_ATOMIC);
  var headers = "";
  if(value_keys.constructor === Array){
    headers = "{";
    for(i = 0; i < value_keys.length; i++){
      headers += "{'"+value_keys[i]+"':'"+value_values[i]+"'},";
    }
    headers = headers.substring(0,headers.length-1);
    headers += "}";
  }else{
    headers = "{"+value_keys+":"+value_values+"}";
  }
  var code = variable_var + '.writeHead('+value_code+','+headers+');\n';
  return code;
};

Blockly.JavaScript['httpsrs_end'] = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var code = variable_var + '.end(' + value_data + ');\n';
  return code;
};

Blockly.JavaScript['url_parse'] = function(block) {
  var variable_url = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('URL'), Blockly.Variables.NAME_TYPE);
  var value_PARSEQUERY = Blockly.JavaScript.valueToCode(block, 'PARSEQUERY', Blockly.JavaScript.ORDER_ATOMIC) || true;
  var code = 'url.parse('+variable_url+', '+value_PARSEQUERY+')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['read_objects_property_'] = function(block) {
  var code = Blockly.JavaScript.valueToCode(block, 'VAR', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
  if (block.itemCount_ == 0) {
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    for (var n = 0; n < block.itemCount_; n++) {
      code += "." + Blockly.JavaScript.valueToCode(block, 'KEY' + n, Blockly.JavaScript.ORDER_COMMA).match(/[a-zA-Z0-9]+/);
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
};

Blockly.JavaScript.text_print = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'print(' + argument0 + ');\n';
};
Blockly.JavaScript.espruino_timeout = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  return ["setTimeout(function() {\n"+branch+" }, "+seconds+"*1000.0)",Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_clear_timeout = function() {
  var timeout = Blockly.JavaScript.valueToCode(this, 'TIMEOUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return "clearTimeout("+timeout+");\n";
};
Blockly.JavaScript.espruino_getTime = function() {
  return ["getTime()\n", Blockly.JavaScript.ORDER_ATOMIC];
};
/*servo module*/
Blockly.JavaScript.espruino_servo = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["require(\"servo\").connect("+pin+")", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_servoMove = function() {
  var pos = Blockly.JavaScript.valueToCode(this, 'POS', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var srv = Blockly.JavaScript.valueToCode(this, 'SRV', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var dur = Blockly.JavaScript.valueToCode(this, 'DUR', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  return srv+".move("+pos+","+dur+(branch == '' ? '' : ",function(){\n"+branch+"\n}")+");\n";	
};

/*EBR00043L module*/
Blockly.JavaScript.espruino_EBR00043L = function() {
  var S1 = Blockly.JavaScript.valueToCode(this, 'S1', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var S2 = Blockly.JavaScript.valueToCode(this, 'S2', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["digitalRead(" + S1 + ") * 2 + digitalRead(" + S2 + ") * 1", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.espruino_interval = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  return ["setInterval(function() {\n"+branch+" }, "+seconds+"*1000.0)",Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_clear_interval = function() {
  var intr = Blockly.JavaScript.valueToCode(this, 'INTERVAL', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return "clearInterval("+intr+");\n";
};
Blockly.JavaScript.espruino_change_interval = function() {
  var intr = Blockly.JavaScript.valueToCode(this, 'INTERVAL', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  return "changeInterval("+intr+","+seconds+"*1000.0);\n";
};
Blockly.JavaScript.espruino_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_watch = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var edge = this.getTitleValue('EDGE');
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  var debounce = Blockly.JavaScript.valueToCode(this, 'DEBOUNCE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var json = { repeat : true, edge : edge, debounce : debounce };
  return "setWatch(function() {\n"+branch+" }, "+pin+", "+JSON.stringify(json)+");\n";
};
Blockly.JavaScript.espruino_digitalWrite = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalWrite("+pin+", "+val+");\n";
};
Blockly.JavaScript.espruino_digitalPulse = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var tim = Blockly.JavaScript.valueToCode(this, 'TIME', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalPulse("+pin+", "+val+", "+tim+");\n";
};
Blockly.JavaScript.espruino_digitalRead = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["digitalRead("+pin+")\n", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_analogWrite = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var freq = Blockly.JavaScript.valueToCode(this, 'FREQ', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  if(freq > 0){
    freq = ',{freq:' + freq + '}';
  }
  else
    freq = '';
  return "analogWrite("+pin+", "+val+""+freq+");\n";
};
Blockly.JavaScript.espruino_analogRead = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return ["analogRead("+pin+")\n", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_code = function() {
  var code = JSON.stringify(this.getFieldValue("CODE"));
  return "eval("+code+");\n";
};
/*
 * Code generation for HC-SR04 sensor connection
 */
Blockly.JavaScript.HCSR04_def = function()
{
  var pinTrig = Blockly.JavaScript.valueToCode(this, 'PIN_trig', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var pinEcho = Blockly.JavaScript.valueToCode(this, 'PIN_echo', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var cb = this.getFieldValue("DO");
  var code = 'require(\"HC-SR04\").connect(' + pinTrig + ', ' + pinEcho + ', ' + cb + ')';
  return [ code, Blockly.JavaScript.ORDER_ATOMIC ];
};

/*
 * Code generation for HC-SR04 sensor read
 */
Blockly.JavaScript.HCSR04_read = function()
{
  var sensor = Blockly.JavaScript.valueToCode(this, 'sensor', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var code = sensor + '.trigger();';
  return code;
};
/*
 * Code generation for YL-64 sensor connection
 */
Blockly.JavaScript.YL64_def = function()
{
  var S0 = Blockly.JavaScript.valueToCode(this, 'S0', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S1 = Blockly.JavaScript.valueToCode(this, 'S1', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S2 = Blockly.JavaScript.valueToCode(this, 'S2', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S3 = Blockly.JavaScript.valueToCode(this, 'S3', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var OUT = Blockly.JavaScript.valueToCode(this, 'OUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [ 'require("TCS3200").connect(' + S0 + ', ' + S1 + ', ' + S2 + ', ' + S3 + ', ' + OUT + ')', Blockly.JavaScript.ORDER_ATOMIC ];
};

/*
 * Code generation for YL-64 sensor read
 */
Blockly.JavaScript.YL64_read = function()
{
  var sensor = Blockly.JavaScript.valueToCode(this, 'sensor', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [sensor + '.getColor()', Blockly.JavaScript.ORDER_ATOMIC];
};

/*wifi*/
/*wifi esp8266 connect*/
Blockly.JavaScript.esp8266_connect = function()
{
  var ser = this.getTitleValue('SER');
  var baud = Blockly.JavaScript.valueToCode(this, 'BAUD', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var rx = Blockly.JavaScript.valueToCode(this, 'RX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var tx = Blockly.JavaScript.valueToCode(this, 'TX', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var cb = Blockly.JavaScript.statementToCode(this, 'DO');
  return ser + ".setup("+baud+", { rx: "+rx+", tx : "+tx+" });\n"+
    "var wifi = require('ESP8266WiFi_0v25').connect("+ser+", function(err){\nif(err)throw err;\n"+cb+"});\n";
};

/*connect to SSID*/
Blockly.JavaScript.connect_ssid = function()
{
  var ssid = this.getFieldValue("SSID");
  var pass = this.getFieldValue("PASS");
  var cb = Blockly.JavaScript.statementToCode(this, 'DO');
  return "wifi.connect('"+ssid+"','"+pass+"', function(err){\nif(err)throw err;\n"+cb+"});\n";
};

/*get IP*/
Blockly.JavaScript.get_IP = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getIP("+cb+");\n";
};

/*get AP*/
Blockly.JavaScript.get_APs = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getAPs("+cb+");\n";
};

/*get version*/
Blockly.JavaScript.get_version = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getVersion("+cb+");\n";
};

/*get version*/
Blockly.JavaScript.get_connected = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getConnectedDevices("+cb+");\n";
};

/*create server*/
Blockly.JavaScript.create_server = function()
{
  var onIncoming = this.getFieldValue("ONINCOMING");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '23';
  return "require('net').createServer(" + onIncoming + ").listen("+port+");\n";
};

/*Bind socket's callbacks*/
Blockly.JavaScript['bind_callbacks'] = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var text_ondata = block.getFieldValue('ONDATA');
  var text_onclose = block.getFieldValue('ONCLOSE');
  var code = variable_var + '.on("data", ' + text_ondata + ');\n' + variable_var + '.on("close", ' + text_onclose + ');\n';
  return code;
};

/*connect server*/
Blockly.JavaScript.connect_server = function()
{
  var host = this.getFieldValue("HOST");
  var onData = this.getFieldValue("ONDATA");
  var onClose = this.getFieldValue("ONCLOSE");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var cb = Blockly.JavaScript.statementToCode(this, 'DO');
  return ["require('net').connect({host: '"+host+"', port: "+port+"},function(c){\nc.on('data', "+onData+");\nc.on('close', "+onClose+");\n"+cb+"\n})", Blockly.JavaScript.ORDER_ATOMIC];
};

/*send data*/
Blockly.JavaScript['send_data'] = function(block) {
  var value_data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC) || "";
  var value_socket = Blockly.JavaScript.valueToCode(block, 'SOCKET', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
  var checkbox_close = block.getFieldValue('CLOSE') == 'TRUE';
  var code;
  var how = "write";
  if(checkbox_close)
    how = "end";
  code = value_socket + "." + how + "(" + value_data + ");\n";
  return code;
};

/*create web server*/
Blockly.JavaScript.create_web_server = function()
{
  var onPageRequest = this.getFieldValue("ONPAGEREQUEST");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ["require('http').createServer("+onPageRequest+").listen("+port+")", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['read_objects_property'] = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_keys = Blockly.JavaScript.valueToCode(block, 'KEYS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '...';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
