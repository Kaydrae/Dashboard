//require('events').EventEmitter.prototype._maxListeners = 100;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var dataIndex = 0;
var steerMotorSpeed;
var releasingBrake;
var applyingBrake;
var leftHallValue;
var rightHallValue;
var leftHallCount;
var rightHallCount;
var leftSteerLimitSwitch;
var rightSteerLimitSwitch;
var brakeReleaseLimitSwitch;
var brakeApplyLimitSwitch;
var potentiometer;
var inAutonomous;
var dataArray = [];
//Send Over a 'pi' Within 1sec Plus
const SerialPort = require("serialport");
const ReadLine = SerialPort.parsers.Readline;

const port = new SerialPort("/dev/serial0", {
	baudRate: 115200,
	dataBits: 8,
   	parity: 'none',
   	stopBits: 1,
   	flowControl: false

});

const parser = port.pipe(new ReadLine({ delimiter: '\n' }));

app.get('/', function(req, res){

	res.sendFile(__dirname + '/views/index.html');

});

io.on('connection', function(socket){

	//console.log('Connected');
	

port.on('open', () => console.log("open"));

parser.on('data', function(data){
dataArray = [];
	if(data.substring(0,4) == 'SBDC'){
		//console.log('Header Found');
		dataIndex = 0;
	}
	else{
		switch (dataIndex){
		case 0:
			steerMotorSpeed = parseInt(data);
			dataArray.push({steerMotorSpeed: steerMotorSpeed});
			io.emit('steerMotorSpeed', steerMotorSpeed);
			break;
		case 1:
			releasingBrake = parseInt(data);
			dataArray.push({releasingBrake: releasingBrake});
			io.emit('releasingBrake', releasingBrake);
			break;
		case 2:
			applyingBrake = parseInt(data);
			dataArray.push({applyingBrake: applyingBrake});
			io.emit('applyingBrake', applyingBrake);
			break;
		case 3:
			leftHallValue = parseInt(data);
			dataArray.push({leftHallValue: leftHallValue});
			io.emit('leftHallValue', leftHallValue);
			break;
		case 4:
			rightHallValue = parseInt(data);
			dataArray.push({rightHallValue: rightHallValue});
			io.emit('rightHallValue', rightHallValue);
			break;
		case 5:
			leftHallCount = parseInt(data);
			dataArray.push({leftHallCount: leftHallCount});
			io.emit('leftHallCount', leftHallCount);
			break;
		case 6:
			rightHallCount = parseInt(data);
			dataArray.push({rightHallCount: rightHallCount});
			io.emit('rightHallCount', rightHallCount);
			break;
		case 7:
			leftSteerLimitSwitch = parseInt(data);
			dataArray.push({leftSteerLimitSwitch: leftSteerLimitSwitch});
			io.emit('leftSteerLimitSwitch', leftSteerLimitSwitch);
			break;
		case 8:
			rightSteerLimitSwitch = parseInt(data);
			dataArray.push({rightSteerLimitSwitch: rightSteerLimitSwitch});
			io.emit('rightSteerLimitSwitch', rightSteerLimitSwitch);
			break;
		case 9:
			brakeReleaseLimitSwitch = parseInt(data);
			dataArray.push({brakeReleaseLimitSwitch: brakeReleaseLimitSwitch});
			io.emit('brakeReleaseLimitSwitch', brakeReleaseLimitSwitch);
			break;
		case 10:
			brakeApplyLimitSwitch = parseInt(data);
			dataArray.push({brakeApplyLimitSwitch: brakeApplyLimitSwitch});
			io.emit('brakeApplyLimitSwitch', brakeApplyLimitSwitch);
			break;
		case 11:
			potentiometer = parseInt(data);
			dataArray.push({potentiometer: potentiometer});
			io.emit('potentiometer', potentiometer);
			break;
		case 12:
			inAutonomous = parseInt(data);
			dataArray.push({inAutonomous: inAutonomous});
			io.emit('inAutonomous', inAutonomous);
			break;
		default:
			break;
		}
			dataIndex++;

		
		if (dataIndex == 13){
			//io.emit('data', dataArray.length);
			dataIndex = 0;
			
		}
		

		
	}

	
	console.log(dataArray);
	//console.log(JSON.parse(dataArray));

	
	
	});

	socket.on('Testing', function(msg){
    		console.log(msg);
		port.write(msg, function(err){
			if(err){
			console.log(err);
			}
			console.log('Message ');
		});
  	});


});


http.listen(3000, function(){

	console.log('On Port 3000');

});

