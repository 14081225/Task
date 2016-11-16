interface Observer {
     onChange(task:Task);
}
class TaskPanel extends egret.DisplayObjectContainer implements Observer{ 
    myphoto:egret.Bitmap;
    textField:egret.TextField[]=[];
    cancelButton:egret.Bitmap;
    nowtaskList:Task[]=[];
    stageH=1136;
    stageW=640;
    constructor(){
        super();
        this.myphoto=this.createBitmapByName("panel_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.cancelButton.touchEnabled=true;
        this.addChild(this.myphoto);
        this.addChild(this.cancelButton);
        this.cancelButton.x=this.cancelButton.width;
        this.cancelButton.y=this.cancelButton.height;
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);

    }
    onChange(task:Task) {
        if(task.status>=2&&task.status<4){
            var k=0;
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1,task);
                    k++;
                }
            }
            if(k==0){
                this.nowtaskList.push(task);
            }

        }if(task.status==4){
            for(let i=0;i<this.nowtaskList.length;i++){
                if(task.id==this.nowtaskList[i].id){
                    this.nowtaskList.splice(i,1);
                    
                }
            }
        }

    }
    onButtonClick() {
        this.onClose();
    }
    onShow() {
        var i=0;
        for(i;i<this.nowtaskList.length&&this.nowtaskList.length!=0;i++){
            var tx=new egret.TextField();
            this.textField.push(tx);
            this.textField[i].text=this.nowtaskList[i].name+"  "+this.nowtaskList[i].desc;
            this.addChild(this.textField[i]);
            this.textField[i].x=100;
            this.textField[i].y=200+100*i;
        }
        
        
    }
    onClose() {
        for(let i=0;i<this.textField.length;i++){
            this.removeChild(this.textField[i]);
        }
        this.textField.splice(0,this.textField.length);
        this.parent.removeChild(this);
    }
     private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class DialoguePanel extends egret.DisplayObjectContainer{ 
    isPanelShow:boolean;
    NPCName:egret.TextField=new egret.TextField();
    textField:egret.TextField=new egret.TextField();
    photo:egret.Bitmap;
    stageH=1136;
    stageW=640;
    taskstatus=0;
    taskid:string;
    acceptButton:egret.Bitmap;
    cancelButton:egret.Bitmap;
    finishButton:egret.Bitmap;
    constructor(){
        super();
        this.isPanelShow=false;
        this.photo=this.createBitmapByName("对话框_png");
        this.acceptButton=this.createBitmapByName("接受_png");
        this.cancelButton=this.createBitmapByName("取消_png");
        this.finishButton=this.createBitmapByName("完成_png");
        this.x=this.stageW-this.acceptButton.width*3-this.x;
        this.y=this.stageH-this.photo.height-2*this.acceptButton.height;
        this.acceptButton.x=this.finishButton.x=this.stageW-this.acceptButton.width*3-this.x;
        this.acceptButton.y=this.finishButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.cancelButton.x=this.stageW-this.acceptButton.width*1.5-this.x;
        this.cancelButton.y=this.stageH-this.acceptButton.height*2-this.y;
        this.NPCName.x=30;
        this.NPCName.y=50;
        this.textField.x=30;
        this.textField.y=100;
        this.textField.text="";
        this.addChild(this.photo);
        this.addChild(this.NPCName);     
        this.addChild(this.textField); 
        this.addChild(this.cancelButton);
        this.cancelButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.Close,this);
        this.acceptButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
        this.finishButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);


    }
 
    public Close() {
      
             if(this.taskstatus==1){
              this.removeChild(this.acceptButton);
              this.taskstatus=0;
               this.acceptButton.touchEnabled=false;
          }
           if(this.taskstatus==3){
              this.removeChild(this.finishButton);
              this.taskstatus=0;
              this.finishButton.touchEnabled=false;
          }
          this.parent.removeChild(this);
          this.isPanelShow=false;
          this.NPCName.text="";
          this.textField.text="";
          this.cancelButton.touchEnabled=false;
        
    }
    public showTask(task:Task){
         if( this.isPanelShow==true ) {
              this.Close();
          }
        this.taskid=task.id;
        this.textField.text=task.desc;
        this.isPanelShow=true;  
        this.cancelButton.touchEnabled=true;   
        this.finishButton.touchEnabled=true;  
        this.acceptButton.touchEnabled=true;  
        if(task.status==1) {
            this.addChild(this.acceptButton);
            this.taskstatus=1;
        }
        if(task.status==3) {
            this.addChild(this.finishButton);
            this.taskstatus=3;
        }
 
    }
    onButtonClick() {
        if(this.taskstatus==1){
            var tas:TaskService=TaskService.getInstance();
            tas.accept(this.taskid);
          
            
        }
        if(this.taskstatus==3){
            var tas:TaskService=TaskService.getInstance();
            tas.finish(this.taskid);
        }
        this.Close();

    }
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}



class Task {
 id:string;
 name:string;
 desc:string;
 status:TaskStatus;
 fromNPCid:string;
 toNPCid:string;


constructor(id,name,desc,status,fromNPCid,toNPCid) {
    this.id=id;
    this.desc=desc;
    this.name=name;
    this.desc=desc;
    this.status=status;
    this.fromNPCid=fromNPCid;
    this.toNPCid=toNPCid;
}

}


class NPC extends egret.DisplayObjectContainer implements Observer {
    id:string;
    name:string;
    emoji:egret.Bitmap;
    photo:egret.Bitmap;
    wrod:string;
    panel:DialoguePanel;
    constructor(i:number,dp:DialoguePanel) {
        super();
        this.id=NPCs[i].id;
        this.name=NPCs[i].name;
        this.photo=this.createBitmapByName(NPCs[i].photo);
        this.addChild(this.photo);
        this.emoji=this.createBitmapByName(emojis[0].name);
        this.addChild(this.emoji);
        this.emoji.x+=this.photo.width/5;
        this.emoji.y-=this.photo.height/4;
        this.panel=dp;
        this.wrod=NPCs[i].word;
    }
    onChange(task:Task) {
      if(task.fromNPCid==this.id) {
          if(task.status==1)
         this.emoji.texture=RES.getRes(emojis[1].name);   
         if(task.status>=2)   
          this.emoji.texture=RES.getRes(emojis[0].name);   
       }
       if(task.toNPCid==this.id&&task.status>1) {
           var i;
           for(i=0;true;i++) {
              if(TaskStatus[TaskStatus[i]]==task.status) {
                   this.emoji.texture=RES.getRes(emojis[i].name);
                   break;
               }
           }
          
       }
    }

    onNPCClick() {

        var ruleOne:Function=(tasklist):Task => {
        var task:Task;
        for(let i=0;i<tasklist.length;i++) {
             if(tasklist[i].toNPCid==this.id) {
                if(tasklist[i].status==2||tasklist[i].status==3){
                         task=tasklist[i];       
                         return task;         
            } 
             }
            if(tasklist[i].fromNPCid==this.id) {
                if(tasklist[i].status==1){
                         task=tasklist[i];  
                             return task;                      
                        }
            }
        }return null;  
    }

        this.panel.NPCName.text=this.name;
        var taskService:TaskService=TaskService.getInstance();
        var task=taskService.getTaskBYCustomRule(ruleOne);
      
        if(task!=null){
             this.panel.showTask(task);
        }else  {
            this.panel.cancelButton.touchEnabled=true;
            this.panel.textField.text=this.wrod;
        }
    }


  
    
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}


class TaskService {

    public observerList:Observer[]=[];
    public taskList:Task[]=[];
    private static instance;
    private static count =0;
    constructor (){
        TaskService.count++;
        if(TaskService.count >1){
            throw 'singleton';
        }

    }
    public static getInstance() {
        if(TaskService.instance ==null) {
            TaskService.instance =new TaskService();
        }
        return TaskService.instance;
    }

    finish (id:String) {
        for(let ta of this.taskList) {
            if(ta.id==id) {
                ta.status=TaskStatus.SUBMITTED;
                this.notify(ta);
            }
        }
    }
    accept (id:String) {
         for(let task of this.taskList) {
            if(task.id==id) {
                task.status=TaskStatus.CAN_SUBMIT;
                this.notify(task);
            }
        }

    }
    public getTaskBYCustomRule(rule:Function):Task{
            return  rule(this.taskList);
    }
    notify(ta:Task) {
        for(let ob of this.observerList) {
            ob.onChange(ta);
        }
    }

}

enum TaskStatus {
    UNACCEPTABLE=0,
    ACCEPTABLE=1,
    DURING=2,
    CAN_SUBMIT=3,
    SUBMITTED=4,
}

let Tasks= [
    {id:"task_00",name:"找小白",desc:"请跟白色的狗对话",status:1,fromNPCid:"npc_0",toNPCid:"npc_1"},
]

let NPCs=[
    {id:"npc_0",name:"灯笼",word:"唉嘿嘿",photo:"NPC_1_png"},
    {id:"npc_1",name:"小白",word:"你咬我呀",photo:"NPC_2_png"},
]

let emojis=[
    {name:""},
    {name:"!_png"},
    {name:"问号淡_png"},
    {name:"问号_png"},
    {name:""},
]