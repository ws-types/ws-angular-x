# ws-angular-x
the new syntax of angular 1.x (1.5.8+)

## NOTES:
### 1. All code are built in ES6 mode, conf typescript file - (tsconfig.json)'s "target" should be set in "es6", "module" is "commonjs";
### 2. Please don't run this code in the ES5/ES3 environment if you work with javascript.
### 3. If running in the prod mode ,conf the UglifyJS to ignore mangle options because the injection service of angular1.x will breaks by uglify. Keep mangle off or try to provide a reversed arr list to prevent uglify breaks the constructor'params name. I'll provide all the injections in need later if posible.

## 1. Module in Declaration

![img01](assets/index01.png)

ng4+ syntax for module creation.

## 2.Component with all lifyCycle hooks

![img02](assets/index02.png)

codeing like ng4+ is possible!

![img06](assets/index06.png)

support view encapsulation:

encapsulation: ViewEncapsulation.Emulated | ViewEncapsulation.None

you can make your css/scss/less works only in component scope, or control component encapsulation to global or emulated.

## 3. Powerful directive

![img03](assets/index03.png)

more lifeCycle hooks and On/Watch events supported.

encapsulation mode is also supported!

## 4.Service without name selector any more

![img04](assets/index04.png)

only to inject and use it.

## 5. More like angular 4+

![img05](assets/index05.png)

even the bootstrap method...

## 6. All dependency, it's real angular1.x

![img07](assets/index07.png)

==============================

### how to use

1. install by npm

```npm
npm install ws-angular-x --save
```
2. config webpack
```javascript
// it's only a demo, config by yourself with what you need.

const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// you may get this loader in this package, try to get from "ws-angular-x/webpack/@ngtools/css-object-loader.js", 
// you can't get it from npm ...
// your component css/scss/less will not work without this loader.
const cssObjectLoader = path.resolve(__dirname, "./webpack/@ngtools/css-object-loader.js");

module.exports = {
    entry: {
        vendor: [
            "angular",
            "bootstrap",
            "jquery",
            "angular-animate",
            "@uirouter/angularjs",
            "reflect-metadata",
            "rxjs",
            "uuid",
            "decamelize",
            "camelcase"
        ],
        index: "./src/web-test/index.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "",
        pathinfo: true,
        chunkFilename: "[name].chunk.js",
        sourceMapFilename: "[file].map",
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['index']
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            "window.jQuery": "jquery"
        })
    ],
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        extensions: [".js", ".json", ".ts"],
        alias: { // ignore this, or you can change this by what your want.
            "@src": path.resolve(__dirname, "src/web-test")
        },
    },
    devtool: "source-map",
    performance: {},
    devServer: {
        contentBase: './dist'
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src/web-test")
                ],
                loader: "babel-loader",
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    cssObjectLoader,
                    'css-loader'
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    cssObjectLoader,
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                include: [path.resolve(__dirname, "index.html")],
                test: /\.html$/,
                use: [
                    "raw-loader"
                ]
            },
            {
                include: [path.resolve(__dirname, "src/web-test")],
                test: /\.html$/,
                use: [
                    "html-loader"
                ]
            }
        ]
    }
}
```
3. import ws-angular-x into your code, and create your module
```typescript
import { ModuleGenerator, $Injects, Config, Run } from "./../@angular";
import { NgModule } from "./../@angular";
import { ComponentsModule } from "@src/components/component.module";
import { DirectivesModule } from "@src/directives/directive.module";
import { AppService } from "@src/services/app.service";
import { AnotherService } from "@src/services/another.service";
import { InjectorModule, InjectorService } from "./../@angular/core/injector";
import { BrowserAnimationsModule } from "./../@angular/core/animations";
import { Routes, RouterModule, Router } from "./../@angular/router";

const rootRoutes: Routes = [
    { state: "settings", loadChildren: "./../settings/settings.module#SettingsModule" },
    { path: "", redirectTo: "settings", pathMatch: "full" },
    { path: "**", redirectToPath: "errors/notfound", pathMatch: "full" }
];

// your module mey like this.
@NgModule({
    imports: [
        InjectorModule,
        RouterModule.forRoot(rootRoutes),
        BrowserAnimationsModule,
        ComponentsModule,
        DirectivesModule
    ],
    declarations: [],
    providers: [
        AppService,
        AnotherService
    ]
})
export class AppModule {

    @Run("@injector", "@router")
    public configInjects(injector: InjectorService, router: Router) {
        // console.log(router.RoutesTree);
    }

}

```
4. bootstrap your app now!
```typescript
import { browserDynamic } from "./../@angular";
import { AppModule } from "./app";

browserDynamic().bootstrapModule(AppModule);

```

============================

### working continue....
