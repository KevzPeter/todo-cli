const fs = require('fs') //File System Module 

const arg2=process.argv[2] //second argument passed
const arg3=process.argv[3] //third argument passed
var todayDate = new Date().toISOString().slice(0,10)//today's date in ISO8601 Format

async function todo(){
    if (arg2 ==="help" || arg2===undefined)
    console.log("Usage :-\n$ ./todo add \"todo item\"  # Add a new todo\n$ ./todo ls               # Show remaining todos\n$ ./todo del NUMBER       # Delete a todo\n$ ./todo done NUMBER      # Complete a todo\n$ ./todo help             # Show usage\n$ ./todo report           # Statistics")
    if (arg2==="add"){
        if(arg3===undefined)
        console.log("Error: Missing todo string. Nothing added!")
        else{
            fs.appendFileSync(`${process.cwd()}/todo.txt`,`\n${arg3}`)
            console.log(`"Added todo: \"${arg3}\""`)
        }
    }
    if(arg2==="ls"){
        fs.readFile(`${process.cwd()}/todo.txt`, 'UTF-8',(err,data)=>{
            if(err)
            console.log("There are no pending todos!")
            else{
                const lines = data.split(/\r?\n/);
                no_lines=lines.length
                if(no_lines===1){
                    console.log("There are no pending todos!")
                }
                else{ //most recently added todo is being displayed first
                    lines.reverse()
                    lines.forEach(el=>{
                        if(no_lines===1) //first blank line
                        null
                        else{
                            console.log(`[${no_lines-1}] ${el}`)
                        }
                        no_lines--
                    })
                }
            }
        })
    }
    if(arg2==="del"){
        if(arg3===undefined){
            console.log("Error: Missing NUMBER for deleting todo.")
        }
        else{
            delete_item(arg3,"del")//deleting task when given argument is 'del'
        }
    }
    if(arg2==="done"){
        if(arg3===undefined){
            console.log("Error: Missing NUMBER for marking todo as done.")
        }
        else{
            fs.readFile(`${process.cwd()}/todo.txt`,'utf-8',(err,data)=>{
                if (err)
                console.log('File does not exist')
                else{
                    const lines = data.split(/\r?\n/);
                    no_lines=lines.length
                    if((parseInt(arg3)>(no_lines-1))||parseInt(arg3)===0){
                        console.log(`Error: todo #${arg3} does not exist.`)
                    }
                    else{
                        completed_task=lines[parseInt(arg3)]
                        console.log(`Marked todo #${arg3} as done.`)
                        fs.appendFileSync(`${process.cwd()}/done.txt`,`\nx ${todayDate} ${completed_task}`)
                        delete_item(arg3,"done")//after marking the task as done, we delete that task from todo.txt
                    }
                }
            })
        }
    }
    if(arg2==="report"){
        var completed=0
        var pending=0
        await getCompleted().then((ans)=>{
            completed=ans
        }).catch(err=>{console.log(err)})
        await getPending().then((ans)=>{
            pending=ans
        }).catch(err=>{console.log(err)})
        console.log(`${todayDate} Pending : ${pending} Completed : ${completed}`)
    }
}
function delete_item(arg3,type){ //function to delete task
    fs.readFile(`${process.cwd()}/todo.txt`,'utf-8',(err,data)=>{
        if (err)
        console.log('File does not exist')
        else{
            const lines = data.split(/\r?\n/);
            no_lines=lines.length
            if((parseInt(arg3)>(no_lines-1))||parseInt(arg3)===0){
                console.log(`Error: todo #${arg3} does not exist. Nothing deleted.`)
            }
            else{
                lines.splice((parseInt(arg3)),1)
                for (var i=0;i<no_lines-1;i++){
                    if(i===0)
                    fs.writeFileSync(`${process.cwd()}/todo.txt`,`${lines[i]}`)
                    else
                    fs.appendFileSync(`${process.cwd()}/todo.txt`,`\n${lines[i]}`)
                }
                if(type==="del")
                console.log(`Deleted todo #${arg3}`)
            }
            
        }
    })
}
function getPending(){ // function to get number of pending tasks from todo.txt
    return new Promise((resolve,reject)=>{
        fs.readFile(`${process.cwd()}/todo.txt`, 'UTF-8',(err,data)=>{
            if(err)
            reject (-1)//file doesnt exist
            else{
                const lines = data.split(/\r?\n/);
                resolve(lines.length-1)
            }
        })
    })
    
}
function getCompleted(){ //function to get number of completed tasks from done.txt 
    return new Promise((resolve,reject)=>{
        fs.readFile(`${process.cwd()}/done.txt`, 'UTF-8',(err,data)=>{
            if(err)
            reject (-1)//file doesnt exist
            else{
                const lines = data.split(/\r?\n/);
                resolve(lines.length-1)
            }
        })
    })
    
}
todo()
