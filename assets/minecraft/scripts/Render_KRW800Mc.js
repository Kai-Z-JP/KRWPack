
//Render_KRW800Mc.js  by unlock [����/�R�s�y/�]�ڂ��ւ���]

//Please do not duplicate or copy.

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);

importPackage(Packages.jp.ngt.rtm.util);
importPackage(Packages.jp.ngt.ngtlib.util);
importPackage(Packages.jp.ngt.ngtlib.renderer);
importPackage(Packages.jp.ngt.ngtlib.io);
importPackage(Packages.jp.ngt.ngtlib.math);

importPackage(Packages.jp.kaiz.atsassistmod.api);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//###################################################################

//doorOpn(Cls)Sec�F�h�A���J��(����)�̂ɕK�v�ȕb��
//doorOpn(Cls)Spd�F�h�A���J��(����)�Ƃ��̎菇
//[�b��,����������(Ұ�ي(������̐��l/100))]

var doorOpnSec = 2.3;
var doorOpnSpd = [[0.04,0.0], [0.18,0.05], [1.68,0.52], [0.12,0.02], [0.22,0.06], [0.06,0.0]];

var doorClsSec = 3.1;
var doorClsSpd = [[0.045,0.0], [0.15,-0.05], [2.165,-0.55], [0.31,-0.01], [0.34,-0.04], [0.09,0.0]];

//�쓮�����F[ 0.65(65) ]
//�g�p�����F[  ]

//###################################################################

var entityID = 0;
var prevTickID = 0;

var doorMovementID = 1;
var doorStateID = 2;
var doorMovingTickID = 3;
var doorTargetMovementID = 4;

var doorMovement;

var doorState;

var doorStateInTrain;

var shouldUpdate;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function init(par1, par2) {

	//�O�� �O��
	body1 = renderer.registerParts(new Parts("�O��", "�O��2", "�O��3", "�O�ʃX�e�b�v", "�O�ʑ�", "�����g", "�肷��", "�O�Ɠ�", "�����", "�O�ʑ���", "�O�ʑ�H�S��"));

	//�O��
	body2 = renderer.registerParts(new Parts("����", "�斱�����O", "�J��", "�ˑܑ�", "�ˑܑ����V���h�E����", "����H�S��", "�ԊO", "���g�O",
						 "���ʑ��O", "�h�A��", "����", "��[", "�ђʔ��O", "�y", "�n���", "��", "TSUMA", "obj6", "obj8"));

	//�O�� ���� (�^�]��)
	cab_body = renderer.registerParts(new Parts("�斱������"));

	//����
	interior = renderer.registerParts(new Parts("��", "���g��", "���ʑ���", "����", "�L���g", "����", "�|�[��",
						    "�d�؂�q����", "�Ȗʓ���", "�ђʔ���", "�V��", "��", "�Ȗ�", "obj4", "obj5"));

	//����
	body3 = renderer.registerParts(new Parts("����", "��", "�e", "�z��", "��q", "�A����", "�W�����p��", "ATS�ԏ�q"));

	//�O�Ɠ�
	headlighton = renderer.registerParts(new Parts("�O�Ɠ��_"));
	headlightoff = renderer.registerParts(new Parts("�O�Ɠ���"));

	//����
	taillighton = renderer.registerParts(new Parts("�����_"));
	taillightoff = renderer.registerParts(new Parts("������"));

	//�h�A�O
	doorLFo = renderer.registerParts(new Parts("door_LF"));
	doorLBo = renderer.registerParts(new Parts("door_LB"));
	doorRFo = renderer.registerParts(new Parts("door_RF"));
	doorRBo = renderer.registerParts(new Parts("door_RB"));

	//�h�A��
	doorLFi = renderer.registerParts(new Parts("door_LFN"));
	doorLBi = renderer.registerParts(new Parts("door_LBN"));
	doorRFi = renderer.registerParts(new Parts("door_RFN"));
	doorRBi = renderer.registerParts(new Parts("door_RBN"));

	//���
	bogieF = renderer.registerParts(new Parts("bogieF")); //�O���
	bogieB = renderer.registerParts(new Parts("bogieB")); //����
	wheelF1 = renderer.registerParts(new Parts("wheelF1")); //�ԗ�
	wheelF2 = renderer.registerParts(new Parts("wheelF2"));
	wheelB1 = renderer.registerParts(new Parts("wheelB1"));
	wheelB2 = renderer.registerParts(new Parts("wheelB2"));

	//����`(����m�F�p)
	Mc = renderer.registerParts(new Parts("����"));
	Br = renderer.registerParts(new Parts("����"));
	Rev = renderer.registerParts(new Parts("����"));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateTick(entity) {

	if(entity == null) return false;

	var dataMap = entity.getResourceState().getDataMap();
	var tick = renderer.getTick(entity);

	var prevTick = dataMap.getInt("prevTick");

	dataMap.setInt("prevTick", tick, false);

	if(tick != prevTick) return true;

	return false;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getArrayFromData(ID,amount) {

	var ret = renderer.getData(ID);
	if(ret == 0)
	{
		ret = [];
		for(var i = 0; i < amount; i++)
		{
			ret[ret.length] = 0;
		}
	}
	return ret;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var HashMap = Java.type("java.util.HashMap");
var isBreaking = new HashMap();

function renderATS(entity) {

	if(entity == null) return;

	//ATS.render(renderer);//➑�

	var dataMap = entity.getResourceState().getDataMap();
	var Signal = entity.getSignal();
	var isControlCar = entity.isControlCar();
	var ATSspeed = entity.getSpeed() * 72.0;

	if(!isControlCar) return;

	function renderATSHelper(int) {

		if(ATSspeed > (int + 15)) {

			//ATS_Emr.render(renderer);

			dataMap.setBoolean('isOver5', false, 1);
			dataMap.setBoolean('isOver10', true, 1);

			ControlTrain.setNotch(-8);
			isBreaking.put(entity, true);

		} else if(ATSspeed > (int + 10)) {

			//ATS_Emr.render(renderer);

			dataMap.setBoolean('isOver5', false, 1);
			dataMap.setBoolean('isOver10', true, 1);

			ControlTrain.setNotch(-7);
			isBreaking.put(entity, true);

		} else if(ATSspeed > (int + 5)) {

			//ATS_Emr.render(renderer);

			dataMap.setBoolean('isOver5', false, 1);
			dataMap.setBoolean('isOver10', true, 1);

			ControlTrain.setNotch(-4);
			isBreaking.put(entity, true);

		} else if(ATSspeed > (int + 1)) {

			//ATS_Arr.render(renderer);

			dataMap.setBoolean('isOver5', true, 1);
			dataMap.setBoolean('isOver10', false, 1);

			if(isBreaking.get(entity)) {
				ControlTrain.setNotch(0);
				isBreaking.put(entity, false);
			}

		} else {
			dataMap.setBoolean('isOver5', false, 1);
			dataMap.setBoolean('isOver10', false, 1);

			if(isBreaking.get(entity)) {
				ControlTrain.setNotch(0);
				isBreaking.put(entity, false);
			}
		}
	}

	switch(Signal) {
		case 10:renderATSHelper(810);
			dataMap.setInt('atsCount', Signal, 10);
			break;

		case 11:renderATSHelper(15);
			dataMap.setInt('atsCount', Signal, 11);
			break;

		case 12:renderATSHelper(25);
			dataMap.setInt('atsCount', Signal, 12);
			break;

		case 13:renderATSHelper(30);
			dataMap.setInt('atsCount', Signal, 13);
			break;

		case 14:renderATSHelper(45);
			dataMap.setInt('atsCount', Signal, 14);
			break;

		case 15:renderATSHelper(65);
			dataMap.setInt('atsCount', Signal, 15);
			break;

		case 16:renderATSHelper(90);
			dataMap.setInt('atsCount', Signal, 16);
			break;

		case 17:renderATSHelper(100);
			dataMap.setInt('atsCount', Signal, 17);
			break;

		case 18:renderATSHelper(110);
			dataMap.setInt('atsCount', Signal, 18);
			break;

		case 19:renderATSHelper(120);
			dataMap.setInt('atsCount', Signal, 19);
			break;

		case 20:renderATSHelper(65);
			dataMap.setInt('atsCount', Signal, 20);
			break;

		case 21:renderATSHelper(45);
			dataMap.setInt('atsCount', Signal, 21);
			break;

		default:
			break;

		}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderController(entity, onUpdateTick) {

	if(entity == null) return;

	var dataMap = entity.getResourceState().getDataMap(); //dataMap�擾
	var notch = entity.getNotch(); //�m�b�`�擾
	var direction = entity.getTrainStateData(10); //���o�[�T�擾

	roMc = dataMap.getDouble("roMcData");   //�f�[�^�ێ�
	roBr = dataMap.getDouble("roBrData");   //
	roRev = dataMap.getDouble("roRevData"); //

	if(onUpdateTick) {

		//-----------------------------------------------------------------------

		//�}�X�R��
		if(notch >= 0){             //�m�b�`��0�ȏ�Ȃ�
			var roMcAngle = notch * -20;  //�}�X�R������p =�m�b�` x -20��
		} else {
			var roMcAngle = 0;           //�u���[�L����p = 0
		}

		//������
		if(roMc > roMcAngle) {
			roMc = roMc - (20 / 2);
		} else if(roMc < roMcAngle) {
			roMc = roMc + (20 / 2);
		}

		//-----------------------------------------------------------------------

		//�u���[�L
		if(notch <= 0){             //�m�b�`��0�ȉ��Ȃ�
			var roBrAngle = notch * -13;  //�}�X�R������p =�m�b�` x -13��
		} else {
			var roBrAngle = 0;           //�u���[�L����p = 0
		}

		//������
		if(roBr > roBrAngle) {
			roBr = roBr - (13 / 2);
		} else if(roBr < roBrAngle) {
			roBr = roBr + (13 / 2);
		}

		//-----------------------------------------------------------------------

		//���o�[�T
		if(notch <= 0){             //�m�b�`��0�ȉ��Ȃ�
			var roBrAngle = notch * -13;  //�}�X�R������p =�m�b�` x -13��
		} else {
			var roBrAngle = 0;           //�u���[�L����p = 0
		}

		//������
		if(roBr > roBrAngle) {
			roBr = roBr - (13 / 2);
		} else if(roBr < roBrAngle) {
			roBr = roBr + (13 / 2);
		}

		//-----------------------------------------------------------------------

	}

	dataMap.setDouble("roMcData", roMc, false);    //�f�[�^�ێ�
	dataMap.setDouble("roBrData", roBr, false);    //
	dataMap.setDouble("roRevData", roRev, false);  //

	//�}�X�R��
	GL11.glPushMatrix();
	renderer.rotate(roMc, 'Y', 0.0000, 0.0000, 0.0000); //��]��
	Mc.render(renderer);
	GL11.glPopMatrix();

	//�u���[�L
	GL11.glPushMatrix();
	renderer.rotate(roBr, 'Y', 0.0000, 0.0000, 0.0000); //��]��
	Br.render(renderer);
	GL11.glPopMatrix();

	//���o�[�T
	GL11.glPushMatrix();
	renderer.rotate(roRev, 'Y', 0.0000, 0.0000, 0.0000); //��]��
	Rev.render(renderer);
	GL11.glPopMatrix();

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//�h�A�̊J�𔻒肵�AdoorOpnSec�Ŏw�肳�ꂽ�b������doorOpnSpd�ɂĎw�肳�ꂽ�X�e�b�v�̏��Ƀh�A���ړ����܂�
//���܂����΁A�������𓮂��������Ƃ��ɗ��p�ł��܂�
function updateDoors(entity)
{
	if(entityID == -1) return;
	var movingTick = getArrayFromData(entityID << doorMovingTickID, 2);
	var updated = false;
	for(var i = 0; i <= 1; i++)
	{
		var b0 = doorStateInTrain == 3 ? true : (i == 0 ? doorStateInTrain == 2 : doorStateInTrain == 1);
		var b1 = doorStateInTrain == 0 ? true : (i == 0 ? doorStateInTrain == 1 : doorStateInTrain == 2);
		if(b0 && doorState[i] == 0)
		{
			doorState[i] = 1;
		}
		if(b1 && doorState[i] == 2)
		{
			doorState[i] = 3;
		}

		//doorState[i]��1(�h�A���J���Ă�r��)�̏ꍇdoorOpnSpd���AdoorState[i]��3(�h�A��߂Ă�r��)�̏ꍇdoorClsSpd��spd�ɑ�����܂��B
		//�ǂ���ł��Ȃ��ꍇ �́Aif(spd != -1)�u���b�N���̃h�A���ړ����鏈�����X�L�b�v���邽��-1�������܂��B
		var spd = doorState[i] == 1 ? doorOpnSpd : (doorState[i] == 3 ? doorClsSpd : -1);
		if(spd != -1)
		{
			var altick = 0;
			for(var j = 0; j < spd.length; j++)
			{
				if(movingTick[i] == 0)
				{
					var doorTargetMovement = getArrayFromData(entityID << doorTargetMovementID, 2);
					var almove = 0;
					for(var l = 0; l < spd.length; l++)
					{
						almove += spd[l][1];
					}
					doorTargetMovement[i] = doorMovement[i] + almove;
					renderer.setData(entityID << doorTargetMovementID, doorTargetMovement);
				}

				var opnSpeed = spd[j][0];
				var movement = spd[j][1];
				//20 ticks per second
				//20tick���b
				if(movingTick[i] <= (altick + (opnSpeed * 20)))
				{
					if(!shouldUpdate) break;

					doorMovement[i] += movement / opnSpeed / 20.0;

					var sec = doorState[i] == 1 ? doorOpnSec : doorClsSec;
					if(movingTick[i] == (sec * 20)-1)
					{
						doorState[i] = (doorState[i] + 1) % 4;
						movingTick[i] = 0;
						var doorTargetMovement = renderer.getData(entityID << doorTargetMovementID);
						doorMovement[i] = doorTargetMovement[i];
					}
					else
					{
						movingTick[i]++;
					}
					updated = true;
					break;
				}
				else
				{
					altick += (opnSpeed * 20);
				}
			}
		}
	}

	if(updated)
	{
		renderer.setData(entityID << doorMovementID, doorMovement);
		renderer.setData(entityID << doorMovingTickID, movingTick);
		renderer.setData(entityID << doorStateID, doorState);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderDoors(io) {

	if(entityID == -1) {

		doorLFi.render(renderer);
		doorLBi.render(renderer);
		doorRFi.render(renderer);
		doorRBi.render(renderer);
		doorLFo.render(renderer);
		doorLBo.render(renderer);
		doorRFo.render(renderer);
		doorRBo.render(renderer);

	} else {

		if(io == 1) {

			GL11.glPushMatrix();
			GL11.glTranslatef(0, 0, doorMovement[0]);
			doorLFi.render(renderer);
			GL11.glTranslatef(0, 0, -(doorMovement[0] * 2));
			doorLBi.render(renderer);
			GL11.glPopMatrix();

			GL11.glPushMatrix();
			GL11.glTranslatef(0, 0, doorMovement[1]);
			doorRFi.render(renderer);
			GL11.glTranslatef(0, 0, -(doorMovement[1] * 2));
			doorRBi.render(renderer);
			GL11.glPopMatrix();

		} else {

			GL11.glPushMatrix();
			GL11.glTranslatef(0, 0, doorMovement[0]);
			doorLFo.render(renderer);
			GL11.glTranslatef(0, 0, -(doorMovement[0] * 2));
			doorLBo.render(renderer);
			GL11.glPopMatrix();

			GL11.glPushMatrix();
			GL11.glTranslatef(0, 0, doorMovement[1]);
			doorRFo.render(renderer);
			GL11.glTranslatef(0, 0, -(doorMovement[1] * 2));
			doorRBo.render(renderer);
			GL11.glPopMatrix();

		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderInterior(entity, onUpdateTick) {

	if(entity == null) return;

	var isControlCar = entity.isControlCar();
	var interiorLightState = entity == null ? 1 : entity.getTrainStateData(11);

	if(interiorLightState > 0) { //��������ON�ł���ꍇ

		NGTUtilClient.getMinecraft().field_71460_t.func_78483_a(0.0) //���������[�h��L���ɂ���

	}

	GL11.glPushMatrix();

	interior.render(renderer); //����������I�u�W�F�N�g���w��(�֐�����)
	renderDoors(1);

	//-----------------------------------------------------------

	if(interiorLightState > 0) {

		if(!isControlCar) { //ControlCar�ł͂Ȃ�(GUI�̋t�]�n���h�����O�ȊO�ł���)�ꍇ

			NGTUtilClient.getMinecraft().field_71460_t.func_78483_a(0.0); //���������[�h��L���ɂ���

		} else {

			NGTUtilClient.getMinecraft().field_71460_t.func_78463_b(0.0); //���������[�h�𖳌��ɂ���

		}
	}

	cab_body.render(renderer); //���t�]�n���h�����O�ȊO�̏ꍇ�ɔ���������I�u�W�F�N�g���w��
	renderController(entity, onUpdateTick);

	if(interiorLightState > 0 && !isControlCar) {

		NGTUtilClient.getMinecraft().field_71460_t.func_78463_b(0.0);//���������[�h�𖳌��ɂ���

	}

	GL11.glPopMatrix();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBogie(entity) {

	var bd0 = 6.50;//��Ԋԋ���(��Ԃ͑O��Ώ̈ʒu�Ƃ���)
		wd0 = 1.05; //��Ԏ�����2
		wy0 = -0.527; //�ԗ֎�Y���W

	var f0 = 0.0,
		bodyYaw = 0.0,
		bogieFYaw = 0.0,
		bogieBYaw = 0.0,
		bodyPitch = 0.0,
		bogieFPitch = 0.0,
		bogieBPitch = 0.0,
		slideX = 0.0,
		slideY = 0.0;

	if(!entity) {} else {
		if(entity != null) {
			try {

				var f0 = renderer.getWheelRotationR(entity);
				var bodyYaw = entity.field_70177_z;

				//�O��ԃ��[���[�J���p
				var i = entity.getBogie(0).field_70177_z - bodyYaw;
				if(i > 180) {
					bogieFYaw = i - 360;
				} else if(i < -180) {
					bogieFYaw = i + 360;
				} else {
					bogieFYaw = i;
				}

				//���ԃ��[���[�J���p
				var i = entity.getBogie(1).field_70177_z - bodyYaw - 180;
				if(i > 180) {
					bogieBYaw = i - 360;
				} else if(i < -180) {
					bogieBYaw = i + 360;
				} else {
					bogieBYaw = i;
				}

				//�s�b�`���[�J���p
				bodyPitch = entity.field_70125_A;
				bogieFPitch = entity.getBogie(0).field_70125_A * -1 + bodyPitch;
				bogieBPitch = entity.getBogie(1).field_70125_A + bodyPitch;

			} catch(error) {}
		}
	}

	//�O���
	GL11.glPushMatrix();
	renderer.rotate(bogieFYaw, "Y", 0.0, 0.0, bd0);
	renderer.rotate(bogieFPitch, "X", 0.0, 0.0, bd0);
	bogieF.render(renderer);
		GL11.glPushMatrix();
		renderer.rotate(f0, "X", 0.0, wy0, bd0 + wd0);
		wheelF1.render(renderer);
		GL11.glPopMatrix();
		GL11.glPushMatrix();
		renderer.rotate(f0, "X", 0.0, wy0, bd0 - wd0);
		wheelF2.render(renderer);
		GL11.glPopMatrix();
	GL11.glPopMatrix();

	//����
	GL11.glPushMatrix();
	renderer.rotate(bogieBYaw, "Y", 0.0, 0.0, -bd0);
	renderer.rotate(bogieBPitch, "X", 0.0, 0.0, -bd0);
	bogieB.render(renderer);
		GL11.glPushMatrix();
		renderer.rotate(f0, "X", 0.0, wy0, -bd0 + wd0);
		wheelB1.render(renderer);
		GL11.glPopMatrix();
		GL11.glPushMatrix();
		renderer.rotate(f0, "X", 0.0, wy0, -bd0 - wd0);
		wheelB2.render(renderer);
		GL11.glPopMatrix();
	GL11.glPopMatrix();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderOtherParts(entity) {

	if(entity == null) {
		headlightoff.render(renderer);
		taillightoff.render(renderer);
		return;
	}

	var trainDir = entity.getTrainStateData(0);

	//�O�Ɠ�
	if(trainDir == 0) { //�i�s
		GL11.glPushMatrix();
		headlighton.render(renderer);
		taillightoff.render(renderer);
		GL11.glPopMatrix();
	} else { //���
		GL11.glPushMatrix();
		headlightoff.render(renderer);
		taillighton.render(renderer);
		GL11.glPopMatrix();
	}

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function render(entity, pass, par3) {

	var onUpdateTick = false;

	if(pass == 0) onUpdateTick = updateTick(entity);

	GL11.glPushMatrix();

	if(pass >= 0) { 

		body1.render(renderer);
		body2.render(renderer);
		body3.render(renderer);

		renderController(entity, onUpdateTick);
		renderATS(entity);
		renderBogie(entity);
		renderOtherParts(entity);

	}

	//-----------------------------------------------------------------------------------------

	if(pass >= 2 || entity == null)
	{
		NGTUtilClient.getMinecraft().field_71460_t.func_78483_a(0.0);
		GLHelper.setLightmapMaxBrightness();
	}

	if(entity == null){
		entityID = -1;
	}
	else{
		entityID = entity.func_145782_y();
		
		var prevTick = renderer.getData(entityID << prevTickID);
		var currentTick = renderer.getTick(entity);
		shouldUpdate = ((prevTick != currentTick) && (pass == 0));
		
		if(shouldUpdate) renderer.setData(entityID << prevTickID, currentTick);
		
		doorState = getArrayFromData(entityID << doorStateID, 2);
		doorMovement = getArrayFromData(entityID << doorMovementID, 2);
		doorStateInTrain = entity.getTrainStateData(4);
		
		updateDoors(entity);
		
	}

	renderInterior(entity, onUpdateTick);
	renderDoors(0);

	if(pass >= 2 || entity == null)
	{
		NGTUtilClient.getMinecraft().field_71460_t.func_78463_b(0.0);
	}

	//-----------------------------------------------------------------------------------------

	GL11.glPopMatrix();

}