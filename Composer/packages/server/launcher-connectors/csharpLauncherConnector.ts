import {LauncherConnector, LauncherStatus} from './interface';

var process = require('child_process');
var composerConfig = require('../../../config.json');

export class CSharpLauncherConnector implements LauncherConnector {

    private path: string;
    private command: string = "dotnet run";
    private child:any = null;

    constructor(config: any) {
        this.path = config.path;
    }

    public status: LauncherStatus = LauncherStatus.Stopped;

    start = () => {
       console.log(`Starting launcher at path: ${this.path}`);

       this.child = process.exec(`cd ${this.path} &&  ${this.command} --bot:provider=${composerConfig.bot.provider} --bot:path=${composerConfig.bot.path}`);
       this.status = LauncherStatus.Running;
       return true;
    }

    stop = () => {
        console.log(`Stopping launcher`);

        // TODO: this not kill sub-process
        this.child.kill();
        this.status = LauncherStatus.Stopped;
        return true;
    }

    inspect = () => {
        return true;
    }
    
}
