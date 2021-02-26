# node-mvc-cli

NodeMVC CLI tool to auto generate a new project.

## ❌ ATTENTION ❌

NodeMVC and NodeMVC CLI are on active developing process and under maintenance but also expterimental at the time of writing, install and use it at your risk!

## Install

Type ```yarn add -G @nodemvc/node-mvc-cli``` or ```npm install -g @nodemvc/node-mvc-cli``` to install the cli tool. Then you'll have global access to `node-mvc` command.

## Get started

Simply run ```node-mvc init``` on your projects directory and follow the instruction.

## Commands

To initialize new NodeMVC project:

```cmd
node-mvc init
```

You can install plugins to provide new functionalities:

```cmd
node-mvc add -n [PLUGIN_NAME]
```

To remove an installed plugin:

```cmd
node-mvc remove -n [PLUGIN_NAME]
```

To get the list of available plugins:

```cmd
node-mvc --available-plugins
```

or

```cmd
node-mvc --ap
```

## Available plugins

| Name            | Status      | Install command                                         |
|-----------------|-------------|---------------------------------------------------------|
| Stripe Payments | Development | ```node-mvc add -n @nodemvc/stripe-payments-provider``` |

More plugins comming soon.
