import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistriesComponent } from './registries/component';
import { SearchComponent } from './search/component';
import { UsersComponent } from './users/component';

const routes: Routes = [
    { path: '', component: SearchComponent },
    { path: 'registries', component: RegistriesComponent },
    { path: 'users', component: UsersComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
