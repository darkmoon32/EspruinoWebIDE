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
  var toolbox = document.getElementById('toolbox');
  // Remove any stuff we don't want from the toolbox...
  for (var i=0;i<toolbox.children.length;i++) {
    var enable_if = toolbox.children[i].attributes.enable_if;
    if (enable_if) {
      var keep = false;
      if (window.location.search && window.location.search.indexOf("%7C"+enable_if.value+"%7C")>=0)
        keep = true;
      if (!keep) {
        toolbox.removeChild(toolbox.children[i]);
        i--;
      }
    }
  }
  // Set up blockly from toolbox
  Blockly.inject(document.body,{path: '', toolbox: toolbox});
  // Set up initial code
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, document.getElementById('blocklyInitial'));
  // Notify parent
  window.parent.blocklyLoaded(Blockly, window); // see core/editorBlockly.js
};

/* TODO: Looks like we could use Blockly.JavaScript.indentLines(code, Blockly.JavaScript.INDENT)
to properly sort out the padding of all this stuff */

// When we have JSON from the board, use it to
// update our list of available pins
Blockly.setBoardJSON = function(info) {
  console.log("Blockly.setBoardJSON ", info);
  if (!("pins" in info)) return;
  if (!("devices" in info)) return;
  PINS = [];
  BTNS = [];
  LEDS = [];
  PWMS = [];
  INS = [];
  var i,s; 
  for (i=1;i<8;i++) {
    s = "RED"+i;
    if (s in info.devices) LEDS.push([s,info.devices[s].pin]);
  }
  for (i=1;i<8;i++) {
    s = "GREEN"+i;
    if (s in info.devices) LEDS.push([s,info.devices[s].pin]);
  }
  for (i=1;i<8;i++) {
    s = "BTN"+i;
    if (s in info.devices) BTNS.push([s,info.devices[s].pin]);
  }
  for (i=1;i<17;i++) {
    s = "PWM"+i;
    if (s in info.devices) PWMS.push([s,info.devices[s].pin]);
  }
  for (i=1;i<5;i++){
    s = "IN"+i;
    if (s in info.devices) INS.push(["PORT_"+s,JSON.stringify(info.devices[s])]);
  }
  for (i=1;i<5;i++){
    s = "OUT"+i;
    if (s in info.devices) INS.push(["PORT_"+s,JSON.stringify(info.devices[s])]);
  }
  for (i in info.pins){
    if(info.pins[i]){
    	PINS.push([info.pins[i].name, info.pins[i].name]);
    }
  
  }
  
};
// ---------------------------------

var ESPRUINO_COL = 190;

var PORTS = ["A","B","C"];
var PINS = [];
for (var p in PORTS)
  for (i=0;i<16;i++) {
    var pinname = PORTS[p]+i;
    PINS.push([pinname,pinname]);
  }

var PWMS = [["PWM1","PWM1"],["PWM2","PWM2"],["PWM3","PWM3"],["PWM4","PWM4"],["PWM5","PWM5"],["PWM6","PWM6"],["PWM7","PWM7"],["PWM8","PWM8"],["PWM9","PWM9"],["PWM10","PWM10"],["PWM11","PWM11"],["PWM12","PWM12"],["PWM13","PWM13"],["PWM14","PWM14"],["PWM15","PWM15"],["PWM16","PWM16"]];
var LEDS = [["RED1","RED1"],["RED2","RED2"],["RED3","RED3"],["RED4","RED4"],["GREEN1","GREEN1"],["GREEN2","GREEN2"],["GREEN3","GREEN3"],["GREEN4","GREEN4"]];
var BTNS = [["BTN1","BTN1"],["BTN2","BTN2"],["BTN3","BTN3"],["BTN4","BTN4"],["BTN5","BTN5"]];
var INS = [["PORT_IN1","{\"A0\":\"A7\",\"D0\":\"D6\",\"D1\":\"C12\",\"D2\":\"D2\"}"],["PORT_IN2","{\"A0\":\"A6\",\"D0\":\"D5\",\"D1\":\"B6\",\"D2\":\"B7\"}"],["PORT_IN3","{\"A0\":\"A5\",\"D0\":\"D4\",\"D1\":\"B10\",\"D2\":\"B11\"}"],["PORT_IN4","{\"A0\":\"A4\",\"D0\":\"D3\",\"D1\":\"C10\",\"D2\":\"C11\"}"],["PORT_OUT1","{\"A0\":\"D12\",\"D0\":\"D13\",\"D1\":\"D15\",\"D2\":\"D14\"}"],["PORT_OUT2","{\"A0\":\"B15\",\"D0\":\"B14\",\"D1\":\"C9\",\"D2\":\"C8\"}"],["PORT_OUT3","{\"A0\":\"E14\",\"D0\":\"E13\",\"D1\":\"A3\",\"D2\":\"A2\"}"],["PORT_OUT4","{\"A0\":\"E11\",\"D0\":\"E9\",\"D1\":\"A1\",\"D2\":\"A0\"}"]];
Blockly.Blocks.espruino_delay = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField(Blockly.Msg.ESPRUINO_WAIT);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_WAIT_TOOLTIP);
  }
};

Blockly.Blocks.espruino_timeout = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('SECONDS')
          .setCheck('Number')
          .appendField(Blockly.Msg.ESPRUINO_AFTER);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);
      this.appendStatementInput('DO')
          .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);

    this.setOutput(true,null);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_AFTER_TOOLTIP);
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
          .appendField(Blockly.Msg.ESPRUINO_EVERY);
      this.appendDummyInput()
          .appendField(Blockly.Msg.ESPRUINO_SECONDS);
      this.appendStatementInput('DO')
           .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_EVERY_TOOLTIP );
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
    var originalPin;
    var listGen = function() {
      originalPin = this.value_;
      var list = PINS.slice(start, start+incrementStep);
      if (start>0) list.unshift([Blockly.Msg.ESPRUINO_BACK+"...", Blockly.Msg.ESPRUINO_BACK]);
      if (start+incrementStep<PINS.length) list.push([Blockly.Msg.ESPRUINO_MORE + '...', Blockly.Msg.ESPRUINO_MORE]);
      return list;
    };

    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){

      if (selection == Blockly.Msg.ESPRUINO_MORE || selection == Blockly.Msg.ESPRUINO_BACK) {
        if (selection == Blockly.Msg.ESPRUINO_MORE)
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

Blockly.Blocks.espruino_LED_pin = {
//      category: 'Espruino',
  init: function() {
    
    var start = 0;
    var incrementStep = 10;
    var originalPin;
    var listGen = function() {
      originalPin = this.value_;
      var list = LEDS.slice(start, start+incrementStep);
      if (start>0) list.unshift([Blockly.Msg.ESPRUINO_BACK+"...", Blockly.Msg.ESPRUINO_BACK]);
      if (start+incrementStep<LEDS.length) list.push([Blockly.Msg.ESPRUINO_MORE + '...', Blockly.Msg.ESPRUINO_MORE]);
      return list;
    };    
    
    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){
      
      if (selection == Blockly.Msg.ESPRUINO_MORE || selection == Blockly.Msg.ESPRUINO_BACK) {
        if (selection == Blockly.Msg.ESPRUINO_MORE)
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

Blockly.Blocks.espruino_BTN_pin = {
//      category: 'Espruino',
  init: function() {
    
    var start = 0;
    var incrementStep = 10;
    var originalPin;
    var listGen = function() {
      originalPin = this.value_;
      var list = BTNS.slice(start, start+incrementStep);
      if (start>0) list.unshift([Blockly.Msg.ESPRUINO_BACK+"...", Blockly.Msg.ESPRUINO_BACK]);
      if (start+incrementStep<BTNS.length) list.push([Blockly.Msg.ESPRUINO_MORE + '...', Blockly.Msg.ESPRUINO_MORE]);
      return list;
    };    
    
    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){
      
      if (selection == Blockly.Msg.ESPRUINO_MORE || selection == Blockly.Msg.ESPRUINO_BACK) {
        if (selection == Blockly.Msg.ESPRUINO_MORE)
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

Blockly.Blocks.espruino_PWM_pin = {
//      category: 'Espruino',
  init: function() {
    
    var start = 0;
    var incrementStep = 10;
    var originalPin;
    var listGen = function() {
      originalPin = this.value_;
      var list = PWMS.slice(start, start+incrementStep);
      if (start>0) list.unshift([Blockly.Msg.ESPRUINO_BACK+"...", Blockly.Msg.ESPRUINO_BACK]);
      if (start+incrementStep<PWMS.length) list.push([Blockly.Msg.ESPRUINO_MORE + '...', Blockly.Msg.ESPRUINO_MORE]);
      return list;
    };    
    
    var pinSelector = new Blockly.FieldDropdown(listGen, function(selection){
      
      if (selection == Blockly.Msg.ESPRUINO_MORE || selection == Blockly.Msg.ESPRUINO_BACK) {
        if (selection == Blockly.Msg.ESPRUINO_MORE)
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
    this.setTooltip(Blockly.Msg.ESPRUINO_PIN_NAME);
  },
};

Blockly.Blocks.switch = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.SWITCH_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.SWITCH_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.SWITCH_HELPURL);
  }
};

Blockly.Blocks.watch_switch = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WATCH_SWITCH_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WATCH_SWITCH_EDGE)
        .appendField(new Blockly.FieldDropdown(this.EDGES), "EDGE");
    this.appendValueInput("DEBOUNCE")
        .setCheck("Number")
        .appendField(Blockly.Msg.WATCH_SWITCH_DEBOUNCE);
    this.appendStatementInput("DO")
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.WATCH_SWITCH_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.WATCH_SWITCH_HELPURL);
  },
EDGES: [
["both", 'both'],
["rising", 'rising'],
["falling", 'falling']]
};

Blockly.Blocks.encoder_connect = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.ENCODER_CONNECT_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.appendValueInput("HOLES")
        .setCheck("Number")
        .appendField(Blockly.Msg.ENCODER_CONNECT_HOLES);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.ENCODER_CONNECT_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.ENCODER_CONNECT_HELPURL);
  }
};

Blockly.Blocks.encoder_get = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.ENCODER_GET_VAR)
        .appendField(new Blockly.FieldVariable("item"), "VAR");
    this.appendDummyInput()
        .appendField(Blockly.Msg.ENCODER_GET_FUNCTION)
        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.ENCODER_GET_FUNCTION_ROUNDS, "getRounds"], [Blockly.Msg.ENCODER_GET_FUNCTION_ANGLE, "getAngle"], [Blockly.Msg.ENCODER_GET_FUNCTION_STEPS, "getSteps"]]), "FUNCTION");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.ENCODER_GET_TOOLTIP);
  }
};

Blockly.Blocks.encoder_reset = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.ENCODER_RESET_VAR)
        .appendField(new Blockly.FieldVariable("item"), "VAR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.ENCODER_RESET_TOOLTIP);
  }
};

Blockly.Blocks.potenciometer = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.POTENCIOMETER_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.POTENCIOMETER_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.POTENCIOMETER_HELPURL);
  }
};

Blockly.Blocks.motor_driver = {
  init: function() {
    this.appendDummyInput()
        .appendField("Motor. Port")
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.appendValueInput("speed")
        .setCheck("Number")
        .appendField("speed");
    this.appendDummyInput()
        .appendField(Blockly.Msg.MOTOR_DRIVER_DIRECTION)
        .appendField(new Blockly.FieldDropdown([["forward", "forward"], ["reverse", "reverse"], ["break", "break"]]), "DIRECTION");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.MOTOR_DRIVER_TOOLTIP);
  }
};

Blockly.Blocks.espruino_watch = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_WATCH);
      this.appendDummyInput()
           .appendField(new Blockly.FieldDropdown(this.EDGES), 'EDGE').appendField('edge');
      this.appendValueInput('DEBOUNCE')
          .setCheck('Number')
          .appendField('debounce');
      this.appendStatementInput('DO')
           .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_WATCH_TOOLTIP);
  },
EDGES: [
["both", 'both'],
["rising", 'rising'],
["falling", 'falling']]
};


Blockly.Blocks.espruino_getTime = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField(Blockly.Msg.ESPRUINO_TIME);
      this.setOutput(true, 'Number');
      this.setColour(230/*Number*/);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_TIME_TOOLTIP);
    }
  };

	
/*EBR00043L block*/
Blockly.Blocks.espruino_ebr00043l = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.LINEFINDER_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.LINEFINDER_TOOLTIP);
  }
};

/*
 * Block for HC-SR04 sensor connection
 */
Blockly.Blocks.hcsr04_def = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.HCSR04_IN)
        .appendField(new Blockly.FieldDropdown(INS), "IN");
    this.appendDummyInput()
        .appendField(Blockly.Msg.HCSR04_CLBK)
        .appendField(new Blockly.FieldTextInput("HCSRcb"), "DO");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.HCSR04_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.HCSR04_HELPURL);
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
          .appendField(Blockly.Msg.ESPRUINO_DIGITALWRITE);
      this.appendValueInput('VAL')
          .setCheck(['Number','Boolean'])
          .appendField(Blockly.Msg.ESPRUINO_VALUE);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALWRITE_TOOLTIP);
  }
};
Blockly.Blocks.espruino_digitalPulse = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_DIGITALPULSE);
        this.appendValueInput('VAL')
            .setCheck(['Boolean']);
        this.appendValueInput('TIME')
            .setCheck(['Number'])
            .appendField(Blockly.Msg.ESPRUINO_MILLISECONDS);

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALPULSE_TOOLTIP);
    }
  };
Blockly.Blocks.espruino_digitalRead = {
  category: 'Espruino',
  init: function() {
      this.appendValueInput('PIN')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_DIGITALREAD);

    this.setOutput(true, 'Boolean');
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_DIGITALREAD_TOOLTIP);
  }
};

Blockly.Blocks.espruino_analogWrite = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_ANALOGWRITE);
        this.appendValueInput('VAL')
            .setCheck(['Number','Boolean'])
            .appendField(Blockly.Msg.ESPRUINO_VALUE);
        this.appendValueInput('FREQ')
            .setCheck('Number')
            .appendField('Frequency');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ANALOGWRITE_TOOLTIP);
    }
  };
Blockly.Blocks.espruino_analogRead = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_ANALOGREAD);

      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ANALOGREAD_TOOLTIP);
    }
  };
Blockly.Blocks.espruino_pinMode = {
    category: 'Espruino',
    init: function() {
        this.appendValueInput('PIN')
            .setCheck('Pin')
            .appendField(Blockly.Msg.ESPRUINO_PINMODE);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(this.PINMODES), 'MODE');

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_PINODE_TOOLTIP);
    },
  PINMODES: [
  ["input", 'input'],
  ["input_pulldown", 'input_pulldown'],
  ["input_pullup", 'input_pullup'],
  ["output", 'output']]
};

Blockly.Blocks.espruino_code = {
    category: 'Espruino',
    init: function() {
      this.appendDummyInput().appendField(new Blockly.FieldTextArea("// Enter JavaScript Statements Here"),"CODE");

      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_JS_TOOLTIP);
    }
  };

  Blockly.Blocks.espruino_jsexpression = {
      category: 'Espruino',
      init: function() {
        this.appendDummyInput().appendField(new Blockly.FieldTextInput('"A JavaScript "+"Expression"'),"EXPR");
        this.setOutput(true, 'String');
        this.setColour(ESPRUINO_COL);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.ESPRUINO_JSEXPR_TOOLTIP);
      }
    };
// -----------------------------------------------------------------------------------
Blockly.Blocks.hw_servoMove = {
  category: 'Espruino',
  init: function() {
    this.appendValueInput('PIN')
        .setCheck('Pin')
        .appendField(Blockly.Msg.ESPRUINO_MOVE_SERVO);
    this.appendValueInput('VAL')
        .setCheck(['Number','Boolean'])
        .appendField(Blockly.Msg.ESPRUINO_TO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_MOVE_SERVO_TOOLTIP);
  }
};
Blockly.Blocks.hw_servoStop = {
  category: 'Espruino',
  init: function() {
    this.appendValueInput('PIN')
        .setCheck('Pin')
        .appendField(Blockly.Msg.ESPRUINO_STOP_SERVO);

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.ESPRUINO_STOP_SERVO_TOOLTIP);

  }
};
Blockly.Blocks.hw_ultrasonic = {
    category: 'Espruino',
    init: function() {
      this.appendValueInput('TRIG')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_ULTRASONIC_GET_TRIG);
      this.appendValueInput('ECHO')
          .setCheck('Pin')
          .appendField(Blockly.Msg.ESPRUINO_ULTRASONIC_ECHO);
      this.setOutput(true, 'Number');
      this.setColour(ESPRUINO_COL);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Msg.ESPRUINO_ULTRASONIC_TOOLTIP);
    }
  };

/*Wifi*/
/*Wifi connect esp8266*/
Blockly.Blocks.esp8266_connect = {
    category: 'Wifi',
    init: function() {
        var dropdown = new Blockly.FieldDropdown([['Serial1', 'Serial1'], ['Serial2', 'Serial2'], ['Serial3', 'Serial3'], ['Serial4', 'Serial4'], ['Serial5', 'Serial5'], ['Serial6', 'Serial6']]);
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
Blockly.Blocks.bind_callbacks = {
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
Blockly.Blocks.send_data = {
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
Blockly.Blocks.read_objects_property_mutator = {
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

Blockly.Blocks.read_objects_property_mutator_container = {
	init:function(){
		this.setColour(ESPRUINO_COL);
		this.appendDummyInput().appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_CONTAINER_TITLE);
		this.appendStatementInput("STACK");
		this.setTooltip(Blockly.Msg.READ_OBJECTS_PROPERTY_MUTATOR_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks.read_objects_property_ = {
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
    if (this.itemCount_ === 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.READ_OBJECTS_PROPERTY_NO_KEY);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('KEY' + i);
        if (i === 0) {
          input.appendField(Blockly.Msg.READ_OBJECTS_PROPERTY);
        }
      }
    }
  }
};

Blockly.Blocks.url_parse = {
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
};

Blockly.Blocks.httpsrs_end = {
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

Blockly.Blocks.httpsrs_writehead = {
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

Blockly.Blocks.text_charCodeAt = {
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

Blockly.Blocks.text_fromcharcode = {
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

/* LCD HD44780 */
Blockly.Blocks.lcd_display_init = {
  init: function() {
    this.appendValueInput("RS")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_RS);
    this.appendValueInput("E")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_E);
    this.appendValueInput("D4")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_D4);
    this.appendValueInput("D5")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_D5);
    this.appendValueInput("D6")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_D6);
    this.appendValueInput("D7")
        .setCheck(null)
        .appendField(Blockly.Msg.LCD_INIT_D7);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.LCD_INIT_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.LCD_INIT_HELPURL);
    this.setColour(ESPRUINO_COL);
  }
};

Blockly.Blocks.lcd_display_clear = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_CLEAR_DISP)
        .appendField(new Blockly.FieldVariable("item"), "DISP");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.LCD_CLEAR_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.LCD_CLEAR_HELPURL);
  }
};

Blockly.Blocks.lcd_display_print = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_PRINT_DISP)
        .appendField(new Blockly.FieldVariable("item"), "DISP");
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField(Blockly.Msg.LCD_PRINT_TEXT);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.LCD_PRINT_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.LCD_PRINT_HELPURL);
  }
};

Blockly.Blocks.lcd_display_set_cursor = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_SET_CURSOR_DISP)
        .appendField(new Blockly.FieldVariable("item"), "DISP");
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_SET_CURSOR_X)
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"]]), "X");
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_SET_CURSOR_Y)
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"]]), "Y");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.LCD_SET_CURSOR_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.LCD_SET_CURSOR_HELPURL);
  }
};

Blockly.Blocks.lcd_display_create_char = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.LCD_CREATE_CHAR_DISP)
        .appendField(new Blockly.FieldVariable("item"), "DISP");
    this.appendValueInput("CHAR")
        .setCheck("Number")
        .appendField(Blockly.Msg.LCD_CREATE_CHAR_CHAR);
    this.appendValueInput("DATA")
        .setCheck("Array")
        .appendField(Blockly.Msg.LCD_CREATE_CHAR_DATA);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.LCD_CREATE_CHAR_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.LCD_CREATE_CHAR_HELPURL);
  }
};

Blockly.Blocks.http_get = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.HTTP_GET_URL)
        .appendField(new Blockly.FieldTextInput("URL"), "URL");
    this.appendDummyInput()
        .appendField(Blockly.Msg.HTTP_GET_CLBK)
        .appendField(new Blockly.FieldTextInput("onGetDone"), "CLBK");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.HTTP_GET_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.HTTP_GET_HELPURL);
  }
};

Blockly.Blocks.createap = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WIFI_CREATEAP_SSID)
        .appendField(new Blockly.FieldTextInput("SSID"), "SSID");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WIFI_CREATEAP_PASSWORD)
        .appendField(new Blockly.FieldTextInput("PASSWORD"), "PASSWORD");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WIFI_CREATEAP_CHANNEL)
        .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]]), "CHANNEL");
    this.appendDummyInput()
        .appendField(Blockly.Msg.WIFI_CREATEAP_ENCODING)
        .appendField(new Blockly.FieldDropdown([["open", "open"], ["wep", "wep"], ["wpa_psk", "wpa_psk"], ["wpa2_psk", "wpa2_psk"], ["wpa_wpa2_psk", "wpa_wpa2_psk"]]), "ENCODING");
    this.appendStatementInput("CB")
        .setCheck(null)
        .appendField(Blockly.Msg.WIFI_CREATEAP_CB);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(Blockly.Msg.WIFI_CREATEAP_TOOLTIP);
    this.setColour(ESPRUINO_COL);
    this.setHelpUrl(Blockly.Msg.WIFI_CREATEAP_HELPURL);
  }
};

Blockly.Blocks.getconnecteddevices = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.WIFI_GET_CONNECTED_DEVICES_CB)
        .appendField(new Blockly.FieldTextInput("getConnectedDevicesCB"), "CB");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.WIFI_GET_CONNECTED_DEVICES_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.WIFI_GET_CONNECTED_DEVICES_HELPURL);
  }
};


Blockly.Blocks.spi_setup = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.SPI_SETUP_SPI)
        .appendField(new Blockly.FieldDropdown([["spi1", "SPI1"], ["spi2", "SPI2"], ["spi3", "SPI3"]]), "SPI");
    this.appendValueInput("MISO")
        .setCheck(null)
        .appendField(Blockly.Msg.SPI_SETUP_MISO);
    this.appendValueInput("MOSI")
        .setCheck(null)
        .appendField(Blockly.Msg.SPI_SETUP_MOSI);
    this.appendValueInput("SCK")
        .setCheck(null)
        .appendField(Blockly.Msg.SPI_SETUP_SCK);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.SPI_SETUP_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.SPI_SETUP_HELPURL);
  }
};

Blockly.Blocks.rc522_init = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.RC522_INIT_SPI)
        .appendField(new Blockly.FieldDropdown([["spi1", "SPI1"], ["spi2", "SPI2"], ["spi3", "spi3"]]), "SPI");
    this.appendValueInput("CS")
        .setCheck(null)
        .appendField(Blockly.Msg.RC522_INIT_CS);
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.RC522_INIT_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.RC522_INIT_HELPUPL);
  }
};

Blockly.Blocks.rc522_findcards = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.RC522_FINDCARDS_RC522)
        .appendField(new Blockly.FieldVariable("item"), "RC522");
    this.appendDummyInput()
        .appendField(Blockly.Msg.RC522_FINDCARDS_CLBK)
        .appendField(new Blockly.FieldTextInput("onDone"), "CLBK");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.RC522_FINDCARDS_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.RC522_FINDCARDS_HELPURL);
  }
};

Blockly.Blocks.json_stringify = {
  init: function() {
    this.appendValueInput("ARRAY")
        .setCheck("Array")
        .appendField(Blockly.Msg.JSON_STRINGIFY_ARRAY);
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.JSON_STRINGIFY_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.JSON_STRINGIFY_HELPURL);
  }
};

Blockly.Blocks.json_parse = {
  init: function() {
    this.appendValueInput("STRING")
        .setCheck("String")
        .appendField(Blockly.Msg.JSON_PARSE_STRING);
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.JSON_PARSE_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.JSON_PARSE_HELPURL);
  }
};

/*servo module*/
Blockly.Blocks.servo_move = {
  init: function() {
    this.appendValueInput("PIN")
        .setCheck(null)
        .appendField(Blockly.Msg.SERVO_MOVE_PIN);
    this.appendValueInput("POS")
        .setCheck("Number")
        .appendField(Blockly.Msg.SERVO_MOVE_POSITION);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(ESPRUINO_COL);
    this.setTooltip(Blockly.Msg.SERVO_MOVE_TOOLTIP);
  }
};

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

Blockly.JavaScript.text_print = function() {
  var argument0 = Blockly.JavaScript.valueToCode(this, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'print(' + argument0 + ');\n';
};
Blockly.JavaScript.espruino_delay = function() {
  var seconds = Blockly.JavaScript.valueToCode(this, 'SECONDS',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  return "var t=getTime()+"+seconds+";while(getTime()<t);\n";
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
Blockly.JavaScript.espruino_pinMode = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var mode = this.getTitleValue('MODE');
  return "pinMode("+pin+", "+JSON.stringify(mode)+");\n";
};
Blockly.JavaScript.espruino_code = function() {
  var code = JSON.stringify(this.getFieldValue("CODE"));
  return "eval("+code+");\n";
};
Blockly.JavaScript.espruino_PWM_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_BTN_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_LED_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_jsexpression = function() {
  var code = this.getFieldValue("EXPR");
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
// -----------------------------------------------------------------------------------
Blockly.JavaScript.hw_servoMove = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var val = Blockly.JavaScript.valueToCode(this, 'VAL', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "analogWrite("+pin+", (1.5+0.7*("+val+"))/20, {freq:50});\n";
};
Blockly.JavaScript.hw_servoStop = function() {
  var pin = Blockly.JavaScript.valueToCode(this, 'PIN', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return "digitalWrite("+pin+", 0);\n";
};
Blockly.JavaScript.hw_ultrasonic = function() {
  var trig = Blockly.JavaScript.valueToCode(this, 'TRIG', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var echo = Blockly.JavaScript.valueToCode(this, 'ECHO', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var funcVar = "ultrasonic"+trig+echo;
  var distanceVar = "dist"+trig+echo;
  var watchVar = "isListening"+trig+echo;
  var functionName = Blockly.JavaScript.provideFunction_(
    funcVar,
    [ "function " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + "() {",
      "  if (!global."+distanceVar+") {",
      "    "+distanceVar+"=[0];",
      "    setWatch(",
      "      function(e) {",
      "        "+distanceVar+"="+distanceVar+".slice(-4);",
      "        "+distanceVar+".push((e.time-e.lastTime)*17544); },",
      "      "+echo+", {repeat:true, edge:'falling'});",
      "    setInterval(",
      "      function(e) { digitalPulse("+trig+", 1, 0.01); }, 50);",
      "  }",
      "  var d = "+distanceVar+".slice(0).sort();",
      "  return d[d.length>>1];",
      "}"]);
  return [funcVar+"()", Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_PWM_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_BTN_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript.espruino_LED_pin = function() {
  var code = this.getTitleValue('PIN');
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.getconnecteddevices = function(block) {
  var text_cb = block.getFieldValue('CB');
  var code = 'wifi.getConnectedDevices('+text_cb+');\n';
  return code;
};

Blockly.JavaScript.createap = function(block) {
  var text_ssid = block.getFieldValue('SSID');
  var text_password = block.getFieldValue('PASSWORD');
  var dropdown_channel = block.getFieldValue('CHANNEL');
  var dropdown_encoding = block.getFieldValue('ENCODING');
  var statements_cb = Blockly.JavaScript.statementToCode(block, 'CB');
  var code = 'wifi.createAP("'+text_ssid+'","'+text_password+'",'+dropdown_channel+',"'+dropdown_encoding+'",function(err){\n\tif(err!==null)throw err;\n\t'+statements_cb+'});\n';
  return code;
};

Blockly.JavaScript.http_get = function(block) {
  var text_url = block.getFieldValue('URL');
  var text_clbk = block.getFieldValue('CLBK');
  var code = 'require("http").get("'+text_url+'", '+text_clbk+');\n';
  return code;
};

Blockly.JavaScript.lcd_display_create_char = function(block) {
  var variable_disp = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('DISP'), Blockly.Variables.NAME_TYPE);
  var value_char = Blockly.JavaScript.valueToCode(block, 'CHAR', Blockly.JavaScript.ORDER_ATOMIC);
  var value_data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_disp + '.createChar(' + value_char + ', ' + value_dat + ');\n';
  return code;
};

Blockly.JavaScript.lcd_display_set_cursor = function(block) {
  var variable_disp = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('DISP'), Blockly.Variables.NAME_TYPE);
  var dropdown_x = block.getFieldValue('X');
  var dropdown_y = block.getFieldValue('Y');
  var code = variable_disp + '.setCursor(' + (dropdown_x - 1) + ', ' + (dropdown_y - 1) + ');\n';
  return code;
};

Blockly.JavaScript.lcd_display_print = function(block) {
  var variable_disp = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('DISP'), Blockly.Variables.NAME_TYPE);
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  var code = variable_disp + '.print(' + value_text + ');\n';
  return code;
};

Blockly.JavaScript.lcd_display_clear = function(block) {
  var variable_disp = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('DISP'), Blockly.Variables.NAME_TYPE);
  var code = variable_disp + '.clear();\n';
  return code;
};

Blockly.JavaScript.lcd_display_init = function(block) {
  var value_rs = Blockly.JavaScript.valueToCode(block, 'RS', Blockly.JavaScript.ORDER_ATOMIC);
  var value_e = Blockly.JavaScript.valueToCode(block, 'E', Blockly.JavaScript.ORDER_ATOMIC);
  var value_d4 = Blockly.JavaScript.valueToCode(block, 'D4', Blockly.JavaScript.ORDER_ATOMIC);
  var value_d5 = Blockly.JavaScript.valueToCode(block, 'D5', Blockly.JavaScript.ORDER_ATOMIC);
  var value_d6 = Blockly.JavaScript.valueToCode(block, 'D6', Blockly.JavaScript.ORDER_ATOMIC);
  var value_d7 = Blockly.JavaScript.valueToCode(block, 'D7', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'require("HD44780").connect(' + value_rs + ',' + value_e + ',' + value_d4 + ',' + value_d5 + ',' + value_d6 + ',' + value_d7 + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.text_fromcharcode = function(block) {
  var value_charcode = Blockly.JavaScript.valueToCode(block, 'CHARCODE', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'String.fromCharCode(' + value_charcode + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.text_charCodeAt = function(block) {
  var value_str = Blockly.JavaScript.valueToCode(block, 'STR', Blockly.JavaScript.ORDER_ATOMIC);
  var value_pos = Blockly.JavaScript.valueToCode(block, 'POS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = value_str + ".charCodeAt(" + ( value_pos - 1 ) + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.httpsrs_writehead = function(block) {
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

Blockly.JavaScript.httpsrs_end = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var value_data = Blockly.JavaScript.valueToCode(block, 'DATA', Blockly.JavaScript.ORDER_ATOMIC) || '';
  var code = variable_var + '.end(' + value_data + ');\n';
  return code;
};

Blockly.JavaScript.url_parse = function(block) {
  var variable_url = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('URL'), Blockly.Variables.NAME_TYPE);
  var value_PARSEQUERY = Blockly.JavaScript.valueToCode(block, 'PARSEQUERY', Blockly.JavaScript.ORDER_ATOMIC) || true;
  var code = 'url.parse('+variable_url+', '+value_PARSEQUERY+')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.read_objects_property_ = function(block) {
  var code = Blockly.JavaScript.valueToCode(block, 'VAR', Blockly.JavaScript.ORDER_ATOMIC) || 'this';
  if (block.itemCount_ === 0) {
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
  } else {
    for (var n = 0; n < block.itemCount_; n++) {
      code += "." + Blockly.JavaScript.valueToCode(block, 'KEY' + n, Blockly.JavaScript.ORDER_COMMA).match(/[a-zA-Z0-9]+/);
    }
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
  }
};

Blockly.JavaScript.servo_move = function(block) {
  var value_pin = Blockly.JavaScript.valueToCode(block, 'PIN', Blockly.JavaScript.ORDER_ATOMIC);
  var value_pos = Blockly.JavaScript.valueToCode(block, 'POS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'analogWrite(' + value_pin + ', (0.8 + 1.4 * Math.min(Math.max(' + value_pos + ', 0), 1)) / 20,{freq : 50});\n';
  return code;
};

//EBR00043L module
Blockly.JavaScript.espruino_ebr00043l = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  return ["digitalRead(" + dropdown_in.D1 + ") * 2 + digitalRead(" + dropdown_in.D2 + ") * 1", Blockly.JavaScript.ORDER_ATOMIC];
};

// Code generation for HC-SR04 sensor connection
Blockly.JavaScript.hcsr04_def = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var text_do = block.getFieldValue('DO');
  var code = 'require(\"HC-SR04\").connect(' + dropdown_in.D2 + ', ' + dropdown_in.D1 + ', ' + text_do + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// Code generation for HC-SR04 sensor read
Blockly.JavaScript.HCSR04_read = function()
{
  var sensor = Blockly.JavaScript.valueToCode(this, 'sensor', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var code = sensor + '.trigger();';
  return code;
};
// Code generation for YL-64 sensor connection
Blockly.JavaScript.YL64_def = function()
{
  var S0 = Blockly.JavaScript.valueToCode(this, 'S0', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S1 = Blockly.JavaScript.valueToCode(this, 'S1', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S2 = Blockly.JavaScript.valueToCode(this, 'S2', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var S3 = Blockly.JavaScript.valueToCode(this, 'S3', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var OUT = Blockly.JavaScript.valueToCode(this, 'OUT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [ 'require("TCS3200").connect(' + S0 + ', ' + S1 + ', ' + S2 + ', ' + S3 + ', ' + OUT + ')', Blockly.JavaScript.ORDER_ATOMIC ];
};

// Code generation for YL-64 sensor read
Blockly.JavaScript.YL64_read = function()
{
  var sensor = Blockly.JavaScript.valueToCode(this, 'sensor', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return [sensor + '.getColor()', Blockly.JavaScript.ORDER_ATOMIC];
};

//wifi
//wifi esp8266 connect
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

//connect to SSID
Blockly.JavaScript.connect_ssid = function()
{
  var ssid = this.getFieldValue("SSID");
  var pass = this.getFieldValue("PASS");
  var cb = Blockly.JavaScript.statementToCode(this, 'DO');
  return "wifi.connect('"+ssid+"','"+pass+"', function(err){\nif(err)throw err;\n"+cb+"});\n";
};

//get IP
Blockly.JavaScript.get_IP = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getIP("+cb+");\n";
};

//get AP
Blockly.JavaScript.get_APs = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getAPs("+cb+");\n";
};

//get version
Blockly.JavaScript.get_version = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getVersion("+cb+");\n";
};

//get version
Blockly.JavaScript.get_connected = function()
{
  var cb = this.getFieldValue("DO");
  return "wifi.getConnectedDevices("+cb+");\n";
};

//create server
Blockly.JavaScript.create_server = function()
{
  var onIncoming = this.getFieldValue("ONINCOMING");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '23';
  return "require('net').createServer(" + onIncoming + ").listen("+port+");\n";
};

//Bind socket's callbacks
Blockly.JavaScript.bind_callbacks = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var text_ondata = block.getFieldValue('ONDATA');
  var text_onclose = block.getFieldValue('ONCLOSE');
  var code = variable_var + '.on("data", ' + text_ondata + ');\n' + variable_var + '.on("close", ' + text_onclose + ');\n';
  return code;
};

//connect server
Blockly.JavaScript.connect_server = function()
{
  var host = this.getFieldValue("HOST");
  var onData = this.getFieldValue("ONDATA");
  var onClose = this.getFieldValue("ONCLOSE");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var cb = Blockly.JavaScript.statementToCode(this, 'DO');
  return ["require('net').connect({host: '"+host+"', port: "+port+"},function(c){\nc.on('data', "+onData+");\nc.on('close', "+onClose+");\n"+cb+"\n})", Blockly.JavaScript.ORDER_ATOMIC];
};

//send data
Blockly.JavaScript.send_data = function(block) {
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

//create web server
Blockly.JavaScript.create_web_server = function()
{
  var onPageRequest = this.getFieldValue("ONPAGEREQUEST");
  var port = Blockly.JavaScript.valueToCode(this, 'PORT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
  return ["require('http').createServer("+onPageRequest+").listen("+port+")", Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.spi_setup = function(block) {
  var dropdown_spi = block.getFieldValue('SPI');
  var value_miso = Blockly.JavaScript.valueToCode(block, 'MISO', Blockly.JavaScript.ORDER_ATOMIC);
  var value_mosi = Blockly.JavaScript.valueToCode(block, 'MOSI', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sck = Blockly.JavaScript.valueToCode(block, 'SCK', Blockly.JavaScript.ORDER_ATOMIC);
  var code = dropdown_spi + '.setup({sck:' + value_sck + ', miso:' + value_miso + ', mosi:' + value_mosi + ' });\n';
  return code;
};

Blockly.JavaScript.rc522_init = function(block) {
  var dropdown_spi = block.getFieldValue('SPI');
  var value_cs = Blockly.JavaScript.valueToCode(block, 'CS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'require("MFRC522").connect(' + dropdown_spi + ', ' + value_cs + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.rc522_findcards = function(block) {
  var variable_rc522 = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('RC522'), Blockly.Variables.NAME_TYPE);
  var text_clbk = block.getFieldValue('CLBK');
  var code = variable_rc522 + '.findCards(' + text_clbk + ');\n';
  return code;
};

Blockly.JavaScript.json_stringify = function(block) {
  var value_array = Blockly.JavaScript.valueToCode(block, 'ARRAY', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'JSON.stringify(' + value_array + ')';
  return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
};

Blockly.JavaScript.json_parse = function(block) {
  var value_string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'JSON.parse(' + value_string + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.switch = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var code = "digitalRead(" + dropdown_in.D2 + ")";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.watch_switch = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var dropdown_edge = block.getFieldValue('EDGE');
  var value_debounce = Blockly.JavaScript.valueToCode(block, 'DEBOUNCE', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_do = Blockly.JavaScript.statementToCode(block, 'DO');
  var json = { repeat : true, edge : dropdown_edge, debounce : value_debounce };
  return "setWatch(function() {\n"+statements_do+" }, "+dropdown_in.D2+", "+JSON.stringify(json)+");\n";
};

Blockly.JavaScript.potenciometer = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var code = 'analogRead(' + dropdown_in.A0 + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.motor_driver = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_direction = block.getFieldValue('DIRECTION');
  if(dropdown_direction == 'forward'){
    return "digitalWrite(" + dropdown_in.A0 + ", false);\nanalogWrite(" + dropdown_in.D0 + ", Math.min(Math.max(" + value_speed + ")), {freq:100});\n";
  }else if(dropdown_direction == 'reverse'){
        return "digitalWrite(" + dropdown_in.D0 + ", false);\nanalogWrite(" + dropdown_in.A0 + ", Math.min(Math.max(" + value_speed + ")), {freq:100});\n";
  }else{
        return "digitalWrite(" + dropdown_in.A0 + ", false);\ndigitalWrite(" + dropdown_in.D0 + ", false);\n";
  }
};

Blockly.JavaScript.encoder_connect = function(block) {
  var dropdown_in = JSON.parse(block.getFieldValue('IN'));
  var value_holes = Blockly.JavaScript.valueToCode(block, 'HOLES', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'require("http://gitlab.fai.utb.cz/jurenat/espruino-modules/raw/master/MyEncoder.js").connect(' + dropdown_in.D1 + ',' + dropdown_in.D2 + ', ' + value_holes + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript.encoder_reset = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var code = variable_var + '.clearRounds();\n';
  return code;
};

Blockly.JavaScript.encoder_get = function(block) {
  var variable_var = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var dropdown_function = block.getFieldValue('FUNCTION');
  var code = variable_var + '.' + dropdown_function + '()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
