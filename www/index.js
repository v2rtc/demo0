class Demo {
    constructor() {
        this.v2sdk = new V2RTC.V2SDK();
        this.myBrowser();
        this.myDeviceStreamsMap = new Map();
        this.currentVideoQuality = 1;
        this.isLogined = false;
        this.currentRoomID = 0;
        this.serverAddressInput = this.findHtmlInputById('serverAddress');
        this.serverPortInput = this.findHtmlInputById('serverPort');
        this.appIDInput = this.findHtmlInputById('appID');
        this.appSecretInput = this.findHtmlInputById('appSecret');
        this.initBtn = this.findHtmlButtonById('initBtn');
        this.roomNameInput = this.findHtmlInputById('roomName');
        this.createRoomBtn = this.findHtmlButtonById('createRoomBtn');
        this.getRoomListBtn = this.findHtmlButtonById('getRoomListBtn');
        this.userNameInput = this.findHtmlInputById('userName');
        this.loginBtn = this.findHtmlButtonById('loginBtn');
        this.logoutBtn = this.findHtmlButtonById('logoutBtn');
        this.roomIDInput = this.findHtmlInputById('roomID');
        this.joinRoomBtn = this.findHtmlButtonById('joinRoomBtn');
        this.leaveRoomBtn = this.findHtmlButtonById('leaveRoomBtn');
        this.chatInput = this.findHtmlInputById('chatInput');
        this.sendChatBtn = this.findHtmlButtonById('sendChatBtn');
        this.localAudioInBtns = this.findHtmlDivById('localAudioInBtns');
        this.localAudioOutBtns = this.findHtmlDivById('localAudioOutBtns');
        this.localVideoBtns = this.findHtmlDivById('localVideoBtns');
        this.streamViewsContainer = this.findHtmlDivById('streamViewsContainer');
        this.logContainer = this.findHtmlDivById('logContainer');
        this.videoQualityBtn1 = this.findHtmlButtonById('videoQualityBtn1');
        this.videoQualityBtn2 = this.findHtmlButtonById('videoQualityBtn2');
        this.videoQualityBtn3 = this.findHtmlButtonById('videoQualityBtn3');
        this.videoQualityBtn4 = this.findHtmlButtonById('videoQualityBtn4');
        this.assignAppEvents();
    }
        
    myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        
        if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            this.document_body();
        }else if((userAgent.indexOf("Firefox") > -1)||(userAgent.indexOf("Chrome") > -1)){
            this.v2sdk.suitUserAgent();
        }else{
            document.getElementById("root").innerHTML = "<div class='area'><p class='text'>该浏览器不支持WebRtc功能，请选择Chrome 或 Firefox 浏览器</p></div>";
        }
    }

    document_body() {
        var doc = document.getElementsByTagName("body")[0];
        doc.innerHTML = '';
        var html = "<div class='area'><p class='text'>该浏览器不支持WebRtc功能，请选择Chrome 或 Firefox 浏览器</p></div>",
        div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div); 
    }

    findHtmlButtonById(id) {
        return document.getElementById(id);
    }
    findHtmlInputById(id) {
        return document.getElementById(id);
    }
    findHtmlDivById(id) {
        return document.getElementById(id);
    }
    assignAppEvents() {
        this.v2sdk.onError = this.onError.bind(this);
        this.v2sdk.onDeviceChange = this.onDeviceChange.bind(this);
        this.v2sdk.onServerDisconnected = this.onServerDisconnected.bind(this);
        this.v2sdk.onUsersLogin = this.onUsersLogin.bind(this);
        this.v2sdk.onUserLogout = this.onUserLogout.bind(this);
        this.v2sdk.onUsersJoinRoom = this.onUsersJoinRoom.bind(this);
        this.v2sdk.onUserLeaveRoom = this.onUserLeaveRoom.bind(this);
        this.v2sdk.onJoinRoomComplete = this.onJoinRoomComplete.bind(this);
        this.v2sdk.onStreamsPublished = this.onStreamsPublished.bind(this);
        this.v2sdk.onStreamUnpublished = this.onStreamUnpublished.bind(this);
        this.v2sdk.onLocalStreamKicked = this.onLocalStreamKicked.bind(this);
        this.v2sdk.onLocalStreamEnded = this.onLocalStreamEnded.bind(this);
        this.v2sdk.onRecvMessage = this.onRecvMessage.bind(this);
        this.v2sdk.onAddRoomDatas = this.onAddRoomDatas.bind(this);
        this.v2sdk.onModifyRoomDataByID = this.onModifyRoomDataByID.bind(this);
        this.v2sdk.onDeleteRoomDataByID = this.onDeleteRoomDataByID.bind(this);
        this.v2sdk.onDeleteRoomDataByType = this.onDeleteRoomDataByType.bind(this);
    }
    logInfo(text) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const nowString = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        this.logContainer.innerHTML = `${this.logContainer.innerHTML}${nowString}:${text}<br />`;
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    logError(error) {
        if (error === V2RTC.v2clienterrors.UserOffline) {
            console.log(error.message);
        }
        else {
            alert(`${error.code}\n${error.name}\n${error.message}`);
        }
    }
    _setBtnEnabled(button, enabled) {
        button.disabled = !enabled;
    }
    resetBtnsEnabled() {
        const bConnected = this.isLogined;
        this._setBtnEnabled(this.loginBtn, !bConnected);
        this._setBtnEnabled(this.logoutBtn, bConnected);
        const bInRoom = !!this.currentRoomID;
        this._setBtnEnabled(this.joinRoomBtn, bConnected && (!bInRoom));
        this._setBtnEnabled(this.leaveRoomBtn, bInRoom);
        this._setBtnEnabled(this.sendChatBtn, bInRoom);
    }
    async onError(error) {
        this.logError(error);
    }
    async onUsersLogin(event) {
        for (const user of event.users) {
            const { userID, userName, userDesc, terminalType, loginDate } = user;
            this.logInfo(`notify: ${userID}-${userName}-${userDesc}使用<b>${terminalType}</b>登录进来了, 时间: ${loginDate}`);
        }
    }
    async onUserLogout(event) {
        const { userID } = event;
        this.logInfo(`notify: ${userID}已注销登录`);
    }
    async onUsersJoinRoom(event) {
        for (const join of event.joins) {
            const { userID, roomID, joinDate } = join;
            this.logInfo(`notify: ${userID}进入房间${roomID}, 时间:${joinDate}`);
        }
    }
    async onUserLeaveRoom(event) {
        const { userID, roomID } = event;
        this.logInfo(`notify: ${userID}退出房间: ${roomID}`);
    }
    async onJoinRoomComplete(event) {
        this.logInfo('入会完成');
    }
    async onDeviceChange(event) {
        await this.enumLocalDevices();
    }
    async onStreamsPublished(event) {
        for (const stream of event.streams) {
            const { userID, streamID, streamName, streamType } = stream;
            this.logInfo(`notify: ${userID}发布流:${streamID}-${streamType}-${streamName}`);
            await this.playStream(userID, streamID, streamType);
        }
    }
    async onStreamUnpublished(event) {
        const { userID, streamID } = event;
        const oViews = await this.v2sdk.findStreamViews(userID, streamID);
        for (const oView of oViews) {
            this.streamViewsContainer.removeChild(oView);
            await this.v2sdk.unplayStream(userID, streamID, oView);
        }
        this.logInfo(`notify: ${userID}取消发布流:${streamID}`);
    }
    async onLocalStreamKicked(event) {
        const { streamID } = event;
        this.resetBtnsEnabled();
        this.logInfo(`notify: ${streamID}被踢出会议室`);
    }
    async onLocalStreamEnded(event) {
        for (const deviceId of this.myDeviceStreamsMap.keys()) {
            const streamID = this.myDeviceStreamsMap.get(deviceId);
            if (streamID === event.streamID) {
                await this.releaseLocalStream(deviceId);
            }
        }
    }
    async onRecvMessage(event) {
        const { fromUserID, toUserID, messageType, messageContent } = event;
        if (messageType === 'chat') {
            if (toUserID) {
                this.logInfo(`notify: ${fromUserID}发来私人聊天消息: ${messageContent}`);
            }
            else {
                this.logInfo(`notify: ${fromUserID}发来公共聊天消息: ${messageContent}`);
            }
        }
    }
    async onAddRoomDatas(event) {
        console.log(event);
    }
    async onModifyRoomDataByID(event) {
        console.log(event);
    }
    async onDeleteRoomDataByID(event) {
        console.log(event);
    }
    async onDeleteRoomDataByType(event) {
        console.log(event);
    }
    async onServerDisconnected(event) {
        console.log('服务器连接已断开:', event);
    }
    async init() {
        const serverAddress = this.serverAddressInput.value;
        const serverPort = this.serverPortInput.value;
        const appID = this.appIDInput.value;
        const appSecret = this.appSecretInput.value;
        try {
            await this.v2sdk.init(appID, appSecret, serverAddress, serverPort);
        }
        catch (error) {
            this.logError(error);
        }
    }
    async createRoom() {
        try {
            const roomName = this.roomNameInput.value;
            const roomDesc = '';
            const result = await this.v2sdk.createRoom(roomName, roomDesc);
            this.logInfo('房间创建成功:' + JSON.stringify(result, null, 4));
        }
        catch (error) {
            this.logError(error);
        }
    }
    async getRoomList() {
        try {
            const count = await this.v2sdk.getRoomCount();
            const roomList = await this.v2sdk.getRoomList(0, count);
            this.logInfo('房间列表:' + JSON.stringify(roomList, null, 4));
        }
        catch (error) {
            this.logError(error);
        }
    }
    async login() {
        try {
            const userName = this.userNameInput.value;
            const userDesc = "";
            const monitorUserStatus = 1;
            const result = await this.v2sdk.login(userName, userDesc, monitorUserStatus);
            this.isLogined = true;
            const { userID, loginDate } = result;
            this.resetBtnsEnabled();
            this.logInfo(`result: 您(${userID})登录成功, 时间:${loginDate}`);
        }
        catch (error) {
            this.logError(error);
        }
    }
    async logout() {
        try {
            await this.v2sdk.logout();
            this.currentRoomID = 0;
            this.isLogined = false;
            this.resetBtnsEnabled();
            this.streamViewsContainer.innerHTML = '';
            this.localAudioInBtns.innerHTML = '';
            this.localAudioOutBtns.innerHTML = '';
            this.localVideoBtns.innerHTML = '';
            this.logInfo('result: 您已注销登录');
            this.logInfo('------------------------------------------');
        }
        catch (error) {
            this.logError(error);
        }
    }
    async joinRoom() {
        try {
            const roomID = this.roomIDInput.value;
            const room = await this.v2sdk.joinRoom(roomID);
            const { roomName, roomDesc, joinDate } = room;
            this.logInfo(`result: 您进入房间${roomID}-${roomName}-${roomDesc}, 时间: ${joinDate}`);
            this.currentRoomID = parseInt(roomID);
            this.resetBtnsEnabled();
            await this.enumLocalDevices();
        }
        catch (error) {
            this.logError(error);
        }
    }
    async leaveRoom() {
        try {
            await this.v2sdk.leaveRoom();
            this.logInfo('result: 您退出房间');
            this.localAudioInBtns.innerHTML = '';
            this.localVideoBtns.innerHTML = '';
            this.streamViewsContainer.innerHTML = '';
            this.currentRoomID = 0;
            this.resetBtnsEnabled();
        }
        catch (error) {
            this.logError(error);
        }
    }
    async enumLocalDevices() {
        let devices;
        try {
            devices = await this.v2sdk.enumLocalDevices();
        }
        catch (error) {
            this.logError(error);
        }
        this.localAudioOutBtns.innerHTML = '';
        this.localAudioInBtns.innerHTML = '';
        this.localVideoBtns.innerHTML = '';
        for (const device of devices) {
            if (device.kind === 'audiooutput') {
                const audioOutBtn = document.createElement('button');
                audioOutBtn.id = device.deviceId;
                audioOutBtn.innerHTML = device.label;
                audioOutBtn.onclick = async () => {
                    await this.v2sdk.setDefaultAudioOutputDevice(device.deviceId);
                };
                const br = document.createElement('br');
                this.localAudioOutBtns.appendChild(audioOutBtn);
                this.localAudioOutBtns.appendChild(br);
                continue;
            }
            const enableBtn = document.createElement('button');
            enableBtn.id = 'enable-' + device.deviceId;
            enableBtn.innerHTML = '启用:' + device.label;
            enableBtn.onclick = () => {
                this.createLocalStream(device.deviceId, device.kind, device.label);
            };
            enableBtn.disabled = false;
            const disableBtn = document.createElement('button');
            disableBtn.id = 'disable-' + device.deviceId;
            disableBtn.innerHTML = '禁用:' + device.label;
            disableBtn.onclick = () => {
                this.releaseLocalStream(device.deviceId);
            };
            disableBtn.disabled = true;
            const br = document.createElement('br');
            switch (device.kind) {
                case 'audioinput':
                    this.localAudioInBtns.appendChild(enableBtn);
                    this.localAudioInBtns.appendChild(disableBtn);
                    this.localAudioInBtns.appendChild(br);
                    break;
                case 'videoinput':
                    this.localVideoBtns.appendChild(enableBtn);
                    this.localVideoBtns.appendChild(disableBtn);
                    this.localVideoBtns.appendChild(br);
                    break;
                default:
                    break;
            }
        }
    }
    async createLocalStream(deviceId, deviceKind, deviceLabel) {
        let audio = '';
        let video = '';
        switch (deviceKind) {
            case 'audioinput':
                audio = deviceId;
                break;
            case 'videoinput':
                video = deviceId;
                break;
        }
        let streamID;
        let streamType;
        try {
            const streamInfo = await this.v2sdk.createStream(audio, video, deviceLabel);
            streamID = streamInfo.streamID;
            streamType = streamInfo.streamType;
            this.myDeviceStreamsMap.set(deviceId, streamID);
            if (streamType.includes('video')) {
                await this.setStreamVideoQuality(streamID, this.currentVideoQuality);
            }
            await this.v2sdk.publishStream(streamID);
            if (streamType !== 'audio') {
                await this.playStream(0, streamID, streamType);
            }
            this.logInfo(`result: 本地流${deviceLabel}启用成功`);
            const enableBtn = document.getElementById('enable-' + deviceId);
            const disableBtn = document.getElementById('disable-' + deviceId);
            enableBtn.disabled = true;
            disableBtn.disabled = false;
        }
        catch (error) {
            if (streamID) {
                await this.v2sdk.releaseStream(streamID);
                this.myDeviceStreamsMap.delete(deviceId);
            }
            this.logError(error);
        }
    }
    async releaseLocalStream(deviceId) {
        try {
            const streamID = this.myDeviceStreamsMap.get(deviceId);
            const oViews = await this.v2sdk.findStreamViews(0, streamID);
            for (const oView of oViews) {
                this.streamViewsContainer.removeChild(oView);
                await this.v2sdk.unplayStream(0, streamID, oView);
            }
            await this.v2sdk.releaseStream(streamID);
            this.myDeviceStreamsMap.delete(deviceId);
            const enableBtn = document.getElementById('enable-' + deviceId);
            const disableBtn = document.getElementById('disable-' + deviceId);
            enableBtn.disabled = false;
            disableBtn.disabled = true;
            this.logInfo(`result: 本地流${streamID}禁用成功`);
        }
        catch (error) {
            this.logError(error);
        }
    }
    async playStream(userID, streamID, streamType) {
        try {
            const view = await this.v2sdk.playStream(userID, streamID);
            if (streamType === 'audio') {
                view.style.display = 'none';
            }
            else {
                view.style.width = '640px';
                view.style.height = '480px';
                view.style.border = '2px solid red';
            }
            this.streamViewsContainer.appendChild(view);
        }
        catch (error) {
            this.logError(error);
        }
    }
    async unplayStream(userID, streamID) {
        try {
            const oViews = await this.v2sdk.findStreamViews(userID, streamID);
            for (const oView of oViews) {
                this.streamViewsContainer.removeChild(oView);
                await this.v2sdk.unplayStream(userID, streamID, oView);
            }
        }
        catch (error) {
            this.logError(error);
        }
    }
    async sendChat() {
        try {
            const toUserID = 0;
            const messageType = 'chat';
            const messageContent = this.chatInput.value;
            await this.v2sdk.sendMessage(toUserID, messageType, messageContent);
            this.logInfo(`result: 您发送公共聊天消息:${messageContent}`);
        }
        catch (error) {
            this.logError(error);
        }
    }
    async setStreamVideoQuality(streamID, quality) {
        this.currentVideoQuality = quality;
        let width;
        let height;
        let frameRate;
        switch (quality) {
            case 1:
                width = 320;
                height = 240;
                frameRate = 20;
                break;
            case 2:
                width = 640;
                height = 480;
                frameRate = 15;
                break;
            case 3:
                width = 1280;
                height = 720;
                frameRate = 10;
                break;
            case 4:
                width = 1920;
                height = 1080;
                frameRate = 5;
                break;
            default:
                return;
        }
        const constraints = {
            aspectRatio: width / height,
            width,
            height,
            frameRate
        };
        await this.v2sdk.setLocalStreamVideoConstraints(streamID, constraints);
    }
    async setVideoQuality(value) {
        try {
            const arrStreamIDs = await this.v2sdk.findUserStreams(0);
            for (const streamID of arrStreamIDs) {
                await this.setStreamVideoQuality(streamID, value);
            }
        }
        catch (error) {
            this.logError(error);
        }
    }
}

const demo = new Demo();