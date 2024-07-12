import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../models/user.model';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

import { UserService } from '../../services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    CommonModule,
    TagModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    SkeletonModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  providers: [MessageService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  submitted = false;
  loading = false;
  currentEditingRow: number | null = null;
  displayDeleteDialog: boolean = false;
  userToDelete!: User | null;
  displayAddUserDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService
      .getUsers()
      .subscribe((data) => {
        this.users = data;
      })
      .add(() => {
        this.loading = false;
      });
  }

  get f() {
    return this.userForm.controls;
  }

  onRowEditInit(user: User, index: number) {
    if (this.currentEditingRow !== null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Já existe uma linha em edição.',
      });
      return;
    }
    this.currentEditingRow = index;
    this.userForm.patchValue(user);
  }

  onRowEditSave(user: User) {
    this.submitted = true;
    if (this.userForm.valid) {
      this.loading = true;
      const updatedUser = this.userForm.value;

      this.userService
        .updateUser(user.id, updatedUser)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Usuário atualizado com sucesso',
            });
            this.loading = false;
            this.currentEditingRow = null;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Falha ao atualizar o usuário',
            });
          },
        })
        .add(() => {
          this.loading = false;
        });
    }
  }

  onRowEditCancel() {
    this.currentEditingRow = null;
  }

  confirmDeleteUser(user: User) {
    this.userToDelete = user;
    this.displayDeleteDialog = true;
  }

  deleteUser() {
    if (this.userToDelete) {
      this.userService
        .deleteUser(this.userToDelete.id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário excluído com sucesso.',
            });
            this.fetchUsers();
            this.hideDeleteDialog();
          },
          error: (error) => {
            console.error('Erro ao excluir usuário:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao excluir usuário.',
            });
            this.hideDeleteDialog();
          },
        })
        .add(() => {
          this.hideDeleteDialog();
        });
    }
  }

  hideDeleteDialog() {
    this.displayDeleteDialog = false;
    this.userToDelete = null;
  }

  showAddUserDialog() {
    this.displayAddUserDialog = true;
    this.userForm.reset();
  }

  hideAddUserDialog() {
    this.displayAddUserDialog = false;
    this.submitted = false;
    this.userForm.reset();
  }

  onAddUser() {
    this.submitted = true;

    if (this.userForm.valid) {
      const newSeller = this.userForm.value;

      this.userService
        .register(newSeller)
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Usuário cadastrado com sucesso',
            });
            this.loading = false;
            this.fetchUsers();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Falha ao atualizar o usuário',
            });
          },
        })
        .add(() => {
          this.loading = false;
          this.hideAddUserDialog();
        });
    }
  }
}
