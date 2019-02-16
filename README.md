#CRUD Operations in Javascript

<p>
This is a great library which provides an eloquent interface for CRUD operations in javascript. Also, it has built in support for Webpack and Typescript.
    
The ability to be fully customized is what make this library suitable for any javascript framework, such as Angular, ReactJS or Vue.js.
    
The CrudRequest class can be fully customized via callbacks for every action.
</p>


<strong>Installation</strong>

`npm install @crud/core`

or

`yarn add @crud/core`



**Usage**

```javascript
import {CrudRequest} from "@crud/core";

const crud = new CrudRequest();
```

**Config**

```javascript
import {ReQuestOptions} from "@crud/core";

crud.config((config:RequestOptions)=>{
    
    config.callbacks.redirect = (to:string)=>{
        window.location.href = to;
    }
    
    config.callbacks.reload = ()=>{
        window.location.reload();
    }
    
    return config;
})
```

**Methods in CrudRequest**

| **Signature**                                                | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| send(options: RequestOptions)=>Promise&lt;any>               | Used to send the request to send data to server and get the response |
| create(url:string, options: RequestOptions)=>Promise&lt;any> | Used to send a create request to server using the send method, but overrides some options to modify the request. |
| retrieve(url: string, options: RequestOptions)=>Promise&lt;any> | Used to send a retrieve request to server using the send method, but overrides some options to modify the request. |
| update(url:string, options: RequeestOptions)=>Promise&lt;any> | Used to send an update request to server using the send method, but overrides some options to modify the request. |
| delete(url:string, options: RequeestOptions)=>Promise&lt;any> | Used to send a delete request to server using the send method, but overrides some options to modify the request. |

