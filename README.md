# <img width="64px" height="64px" src="https://i.postimg.cc/rwvQsC6D/emotion.png"> Diary Emotion Tracking
This project is a digital personal diary platform. The platform is designed to keep track of one's days and to gain awareness of one's feelings, encouraging one to see the positive aspects of life. 

It consists of two systems:
* a **Web Application**, which allows registration to the platform via Microsoft account, creation of personal pages textually and with speech recognition, sentiment analysis and daily reporting of sentiment analysis;
* a **Telegram Bot**, which allows the creation of diary pages textually or with voice recognition or again, with intelligent description of an image and sentiment analysis.
---
# <img width="64px" height="64px" src="https://i.postimg.cc/g2XqRXd1/cloud-1.png"> Architecture
The user via the Microsoft provider through "***Azure Active Directory***" can authenticate on the Web Application. After the first login, he will be assigned a token to authenticate on the Telegram Bot as well.
The **Web Application** has been deployed through the "***App Service***" service.
The **Telegram Bot** was deployed through the "***App Service***" service and was configured through the "***Azure Bot***" service, on the Telegram channel.
Both the WebApp and the Bot interface with the "***Serverless Functions***" to query the database.
The database was designed and deployed with the "***CosmosDB***" service and is queried through its "***SQL API***". 
In addition, the WebApp and the Bot query the "***Cognitive Services***" to achieve sentiment analysis, OCR recognition, and speech recognition.

<p align="center" >
  <img src="https://i.postimg.cc/MHc9XcFZ/Progetto-Cloud-drawio.png">
</p>

# <img width="64px" height="64px" src="https://i.postimg.cc/264zMwYh/azure.png"> Azure Service
* AppService: service used for deploying the Web Application and Telegram Bot.
* BotService: service used for creating and managing the Telegram bot used by our users.
* Azure Active Directory: service used for authentication in the Web App through the Microsoft identity provider.
* CosmosDB: service used for creation and management of the serverless, high-performance and scalable database.
* Language Service: service used to automatically detect sentiments.
* Speech to Text: service used to obtain accurate audio-to-text transcripts with speech recognition.
* Computer Vision: service used to generate printed and handwritten text from images and documents (optical character recognition).
* Serverless Functions: service used to manage the back-end through functions in a serverless environment.
---

# <img width="64px" height="64px" src="https://i.postimg.cc/7Z2YSDRK/maintenance.png"> Installation
First of all it is necessary an Azure Subscription and you need to clone our repository:
```bash
git clone https://github.com/gerardodonnarumma99/diary-emotion-tracking-esame-di-cloud-computing.git
```

Create the resources used on the azure portal through the Azure CLI or the online platform.

Run this command on the Azure CLI to log into:
```bash
az login
```

## AppService
Follow these simple steps for the WebApp creation!
1.  Go to the [home](https://portal.azure.com/#home)   
2.  Press "Create a resource"   
3.  Choose App Service WebApp  
4.  Insert all the information about the WebApp configuration:
    > Your subscription      
    > Resource Group Name (the previous one)     
    > Publish: Code    
    > Runtime stack: Java 11    
    > Java webserver stack: Tomcat 9.0    
    > Operating system: Windows    
    > Region: West Europe    
    > SKU: Free    
    > ASP Name: < your-asp-name >    
    > GitHub Account: < your-account-name >    
    > Organization:  < your-organization-name >    
    > Repository: < your-repository >    
    > Branch: < your-branch-name >    
5. Have fun with your best IDE and its Azure plugin as at the link [here](https://docs.microsoft.com/en-gb/azure/app-service/quickstart-java?tabs=tomcat&pivots=platform-windows), our configuration was [IntelliJ IDEA](https://www.jetbrains.com/idea/download/#section=windows) with the [Azure toolkit plugin](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij/).

## Bot Service
  In order to start the (creation - working - deploying)  process, you have to:  
  * Download [Node.js 16.x](https://nodejs.org/en/download/releases/)     
  * Download [Bot Framework Emulator](https://dev.botframework.com)       
  * Installare Yeoman e il generatore Yeoman per Bot Framework v4: 
    1. Open terminal with administrator privileges     
    2. Install Yeoman   
    ```bash
    npm install -g yo
    ```
    3. Install Yeoman generator
    ```bash
    npm install -g generator-botbuilder
    ```   
    __Bot Creation__
    
    Use the generator for the creation of a core bot    
    ```bash
        yo botbuilder
    ```        
    Output after the entire command execution    
    ```bash
       ? What's the name of your bot? < my-chat-bot >      
       ? What will your bot do? < Description of bot >          
       ? What programming language do you want to use? JavaScript         
       ? Which template would you like to start with? Core Bot - https://aka.ms/bot-template-core           
       ? Looking good.  Shall I go ahead and create your new bot? Yes         
    ```       
       
    __Run the Bot__       
   
    Open terminal, find your project directory and run this command
    
      ```bash
            npm start
      ```     
    Now the bot is running on 3978 port      
    Run the emulator and connect it to the bot      
   * Open Bot Framework Emulator    
   * Click "Open Bot"    
   * Type the Bot url usually is an url like, http://localhost:3978/api/messages    
   * Select "Connect"          
   
   __Deploy Azure Bot__       
   
   You must have a Javascript Bot locally developed       
   Create the App Service for the Bot hosting       
   ```bash
      az ad app create --display-name <displayName> --password <AtLeastSixteenCharacters_0> --available-to-other-tenants
   ``` 
   Save appId & appSecret for the next step     
   
   Execute the deploy through arm model with a new resource group     
   ```bash
      az deployment sub create --template-file <path-to-template-with-new-rg.json> --location <region-location-name> --parameters appId=<app-id-from-previous-step> appSecret=<password-from-previous-step>botId=<id or bot-app-service-name> botSku=F0 newAppServicePlanName=<new-service-plan-name> newWebAppName=<bot-app-service-name> groupName=<new-group-name> groupLocation=<region-location-name> newAppServicePlanLocation=<region-location-name> --name=<bot-app-service-name>
   ``` 
         
  
   Prepare your project for the deploy       
  * Set MicrosoftAppId & MicrosoftAppPassword in a file .env from the previous appId & appSecret     
  * Move to project directory in a terminal window         
   ```bash
      az bot prepare-deploy --code-dir "." --lang Javascript
   ``` 
  * Make a .zip file containing all the project files and then       
   ```bash
      az webapp deployment source config-zip --resource-group <resource-group-name> --name <name-of-web-app> --src <project-zip-path>
   ``` 

## Azure Active Directory
To create a registered application from the Azure CLI, you need to be logged in to the Azure account where you want the operations to take place. To do this, you can use the az login command and enter your credentials in the browser. Once you are logged in to your Azure account from the CLI, we can call the az ad sp create-for-rbac command to create the registered application and service principal.
The following examples uses the Azure CLI to create a new registered application:

```bash
    az login
    az ad sp create-for-rbac --name <application-name> --role Contributor --scopes /subscriptions/<subscription-id>
``` 

__Enable Azure Active Directory in your App Service app__
1. Go to the [home](https://portal.azure.com/#home)   
2. Select Authentication in the menu on the left. Click Add identity provider. 
3. Select Microsoft in the identity provider dropdown. 
4. For App registration type, you can choose to Pick an existing app registration in this directory which will automatically gather the necessary app information. If your registration is from another tenant or you do not have permission to view the registration object, choose Provide the details of an existing app registration. The client secret will be stored as a slot-sticky application setting named MICROSOFT_PROVIDER_AUTHENTICATION_SECRET. You can update that setting later to use Key Vault references if you wish to manage the secret in Azure Key Vault.
5. If this is the first identity provider configured for the application, you will also be prompted with an App Service authentication settings section. Otherwise, you may move on to the next step. These options determine how your application responds to unauthenticated requests, and the default selections will redirect all requests to log in with this new provider. You can change customize this behavior now or adjust these settings later from the main Authentication screen by choosing Edit next to Authentication settings.
6. Click Add.

You're now ready to use the Microsoft identity platform for authentication in your app. The provider will be listed on the Authentication screen. From there, you can edit or delete this provider configuration.

__Native client application__
You can register native clients to request access your App Service app's APIs on behalf of a signed in user.
1. Go to the [home](https://portal.azure.com/#home), select Active Directory > App registrations > New registration.
2. In the Register an application page, enter a Name for your app registration.
3. In Redirect URI, select Public client (mobile & desktop) and type the URL <app-url>/.auth/login/aad/callback. For example, https://contoso.azurewebsites.net/.auth/login/aad/callback.
4. Select Create.
5. After the app registration is created, copy the value of Application (client) ID.
6. Select API permissions > Add a permission > My APIs.
7. Select the app registration you created earlier for your App Service app. If you don't see the app registration, make sure that you've added the user_impersonation scope in [Create an app registration in Azure AD for your App Service app](https://docs.microsoft.com/en-us/azure/app-service/configure-authentication-provider-aad#register).
8. Under Delegated permissions, select user_impersonation, and then select Add permissions.

You have now configured a native client application that can request access your App Service app on behalf of a user.

---
## Serverless Function
In order to start the (creation - working - deploying)  process, you have to:
* Download [Node.js 16.x](https://nodejs.org/en/download/releases/)
* Download [Visual Studio Code](https://code.visualstudio.com)
* Install [Visual Studio Code Azure plugin](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* Instal [Azure Function Core Tools 4.x](https://docs.microsoft.com/it-it/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools) based on your system.     

Let's start!

1. Login into Azure using the Azure plugin    
2. Create a New Project using the Azure plugin(Function Area)    
3. You can now edit and run your function locally    
4. Use the deploy button of the Azure plugin for an easily deploy

Official Microsoft Azure Guide about Serverless function [here](https://docs.microsoft.com/it-it/azure/azure-functions/create-first-function-vs-code-node)   

## CosmosDB with SQL API
Create a Resources Group:
```bash
az group create --name $resourceGroup --location "$location" --tags $tag
```

Create a Cosmos account for SQL API:
```bash
az cosmosdb create --name $account --resource-group $resourceGroup --default-consistency-level Eventual --locations regionName="$location" failoverPriority=0 isZoneRedundant=False --locations regionName="$failoverLocation" failoverPriority=1 isZoneRedundant=False
```

Create a SQL API database:
```bash
az cosmosdb sql database create --account-name $account --resource-group $resourceGroup --name diary_emotion_db
```

Create a SQL API container:
```bash
az cosmosdb sql container create --account-name $account --resource-group $resourceGroup --database-name $database --name user --partition-key-path id --throughput 400 --idx @idxpolicy-$randomIdentifier.json
az cosmosdb sql container create --account-name $account --resource-group $resourceGroup --database-name $database --name diary --partition-key-path id --throughput 400 --idx @idxpolicy-$randomIdentifier.json
```

## Cognitive Service
You can access Azure Cognitive Services through two different resources: A multi-service resource, or a single-service one.

Multi-service resource:
* Access multiple Azure Cognitive Services with a single key and endpoint.
* Consolidates billing from the services you use.
Single-service resource:
* Access a single Azure Cognitive Service with a unique key and endpoint for each service created.
* Use the free tier to try out the service.

__Create a new Azure Cognitive Services resource group__
To create a resource, you'll need one of the Azure locations available for your subscription. You can retrieve a list of available locations with the az account list-locations command. Most Cognitive Services can be accessed from several locations. Choose the one closest to you, or see which locations are available for the service.
```bash
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```
In the example below, replace the Azure location westus2 with one of the Azure locations available for your subscription.
```bash
az group create \
    --name cognitive-services-resource-group \
    --location westus2
```

### Speech Service
Creation of the resource using Azure Web Portal        
 
1.  Go to the [home](https://portal.azure.com/#home)        
2.  Press "Create a resource"        
3.  Choose "Speech Services"             
4.  Insert informations about the resource         
    > Subscription: < your subscription >          
    > Resource group name: < your-resource-group >            
    > Region:   < West Europe  >         
    > Resource Name:  < Name >           
    > SKU:   < Free F0 > 

### Language Service
Creation of the resource using Azure Web Portal        
 
1.  Go to the [home](https://portal.azure.com/#home)        
2.  Press "Create a resource"        
3.  Choose "Language Service"             
4.  Insert informations about the resource         
    > Subscription: < your subscription >          
    > Resource group name: < your-resource-group >            
    > Region:   < West Europe  >         
    > Resource Name:  < Name >           
    > SKU:   < Free F0 >       

### Computer Vision
Creation of the resource using Azure Web Portal        
 
1.  Go to the [home](https://portal.azure.com/#home)        
2.  Press "Create a resource"        
3.  Choose "Computer Vision"             
4.  Insert informations about the resource         
    > Subscription: < your subscription >          
    > Resource group name: < your-resource-group >            
    > Region:   < West Europe  >         
    > Resource Name:  < Name >           
    > SKU:   < Free F0 >       

