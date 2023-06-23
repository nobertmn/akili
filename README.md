# mpolaui

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


* remove currency from batch upload

### To Demo

1 - Registration Form         [Security Concerns]
2 - Multi tenancy             [Performance - Sacalability - Maintance - Reliability - Speed of results - Concerns]
3 - Improved loading speeds   [Performance - Sacalability Concerns]
4 - Tool tips integration     [User Friendly]
5 - Account Activation Form   [Security Concerns]
6 - Password Strength Meter   [Security Concerns - User Friendly]
7 - Live support Integration  [User Friendly]
8 - Google Analytics          [Sales]
9 - Improved Batch Upload     [User Friendly] - allows for editing, continue from where you stopped
10 -Onboarding Process        [User Friendly]
11 -Initial Default data      [User Friendly - Initial Setup Default Conditions - Configurations]
12 -Timeout due to inactivity [Security Concerns]
13 -Inviation Of Team/Users   [Security Concerns]
14 -Password Recovery         [Security Concerns]
15 -Login                     [Security Concerns]
16 -Documentation Tool        [User Friendly, Maintaince, QA - UAT]
17 -Youtube channel           [User Friendly, Maintaince, QA - UAT]
18 -Required Fields * Asteric [User Friendly]
19 -Error messages on Fields  [User Friendly] - and also highlighlighting the fields with issues
20 -Full form validations     [Security Concerns, Correctness]

### The project relies on https://mdbootstrap.com/

When on the timeout popup window, after a user logs in, check if they are qualified to even be on that page

-> setting - role permissions - align the yes/no columns in the center and color a yes value differently from a no value

--> On all pages investigate the showing of a loader when executing any http activites, and also all buttons, inputs and anchors should be disabled during loading

--> settings - users - show avatars/uer profile pics

--> All modals with forms that have cancel, close or ok buttons showing should not be able to interact when a form is being posted

--> The system admin role cannot be deleted the role, but email and name can be edited, a system admin user cannot be deleted and cannot be deactivated

--> prompts of showing success when you have finished successfully submiting a form

--> Finish the description for all the departments in the departments data file


## Salvage Formula

```c#
    decimal salvage = 0;
    if (item.useful_years > 0)
    {
        salvage = item.purchase_cost / item.useful_years;
    }
```

## Todo also

Add a details view popup on the assets list page

Add filter status buttons/pills/boxes on the requisitions table

Add the ability to merge custodians into 1 and link to a system user

Dashboard should have utility to guuide the user on what to do next

Producing alerts and showing status of assets that were collected 
and are past their return date

Add rules to the requistion process in that one cannot approva an asset
requisition if that asset has not yet been returned. 

One cannot transfer the asset to the same branch

Notifications and alerts on the tansfer module

Cannot transfer an asset that is on not on a In Store status

On the transfer form under assets - prevent adding assets twice or more 

Notifications/alerts to connected parties when a transfer has been rejected or when the requisition has been rejected and other transfer statuses, please see
what alerts can be generated

You can only request, transfer, allocate assets that are in your branch
this means that upload batch file upload the assets if not allocated
must be in store and the asset table should maintain a current_branch_id
column so that we always know where it is currently locatted and the rule
is that an asset can be in store of a branch without any allocation entries
but an allocation entry cannot exist without the asset having a matching
branch_id value.
So forms must pull assets that belong to the users branch - haha

Also look into what forms when updated should generate
alerts for concerned stack holders

When you delete a disposal, all the bucket items have to goback to a status of marked

When you delete a disposal bucket item, the asset must remove 
its marked flag and go back to a 0 flag

When adding assets during disposal, you cannot add an asset that is already selected

When adding items to the disposal bukcet and especially the 
disposal request, we need to build a configuration that puts
into account the time it may take to dispose off these items
so that we calculate the value putting into effect one
more month. This is entirely upto the clients to decide this
buffer period in terms of days.

May be a branch or the entire organisation can have a config which doesnt allow more than one 
disposal request to run at the same 
time


Deleting a disposal is only currently allowed when the status is pending,
In this case we dont need to reverse any asset statuses and also the bucket is not affetce - this is the current implementation but things may change if we allow deleting
of disposals when status is higher than pending


Notify cincerned parties when an asset disposal has been rejected

When adding a category in the register module, make sure that the 
credit account is not the same as the debit account validations

We may need to change asset categories into asset classes, then the 
categories become the general groups. but on the scond thought asset types
can be taken care of by the nested asset categories.

Deleting of an asset category is complicated for now due to linked-nested 
records

Does the purchase order send and email to the supplier if it has been approved

On the create purchase order form, under adding assets, make sure not to reapeat
an asset twice but you can just merge the two items and override the unit price
or alert a user that the item has already been added. Also on the same 
screen to add commas to the money displayed on the table


On purchases add acquisation form, on the asset tab, when in editing the 
selected asset disable the edit table buttons and the delete buttons other wise an item can be removed yet its in editing.


For the mail, use the Xyola Email Address on Mail gun

In the purchase module under the receive modal form, it may be necessary for us to build a feature 
where one can work on some items and save progress or every edit is saved to the db without waiting 
for all items to be worked on. For every save, we cahecked if all have been worked on, if this is true
we finish the receive stage/phase

Number of unrecorded  acquired assets should contribute to data on the 
dashboard, also the unresolved missing purcahsed items

In the notifications submoodue, according to my user roles, filter out the general notifications that i am not supposed to see

In near futrue upgrades under the maintenace, impairment, insurance and waranty
we need to use the calendar to greatly improve the user experience Ux.
We can use this calender its good: https://vcalendar.io


On viewing of an asset maintenance, we need to display the historical list of the different maintenances that were performed
highlighting the slected one, the ones that come after and the ones that had been done before

Probaly in the maintenace phases of scheduling, and 
one can add new support documents but not being able to 
delete already added support documents

on adding asset maintenace schedule items, make sure not to allow adding an item twice

try to eliminate disposed or lossst-theft assets in so many areas

Add a health data integrity checker to check for records with missing parent data.
this might be cases of transactions that happened half way

Background service to also check insurance and warranty expiry

Got the chat accounts from this cached link
https://webcache.googleusercontent.com/search?q=cache:01ITvAUDHvgJ:https://www.consultyourcfo.com/designing-a-chart-of-account-coa-structure/&cd=14&hl=en&ct=clnk&gl=ug

Assets that are of value ["Loss / Stolen", "Disposed", etc] should contribute a value of
0 under the asset register and do not register any depreciations or appreciations in the background. 


Indicate that the depreciation is an estimate. add an indicator e.g light red
for this but highlight the ones in green that are sure to be used

Assets bought in different currencies, break down in the dashboard

Snapshots of currencies and exchange rates on specific - 3x


icons 
https://unicons.iconscout.com/release/v1.0.0/index.html