import { NgClass } from '@angular/common';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionService } from 'src/entities/collection';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-system-folders',
  templateUrl: './system-folders.component.html',
  imports: [IconComponent, NgClass],
})
export class SystemFoldersComponent {
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionService);

  inputRef = viewChild<HTMLInputElement>('inputRef');

  isCheckable = input<boolean>(false);
  clickFolder = output<number | undefined>();

  selectedId = signal<number | undefined>(undefined);

  collections = this.collectionService.collections;

  constructor() {
    this.collectionService.getCollections();
  }

  get systemFolders() {
    return [
      { id: this.collections().unCategorized?.id, label: '미분류', name: 'uncategorized', postCount: this.collections().unCategorized?.postCount },
      { id: this.collections().trash?.id, label: '휴지통', name: 'trash', postCount: this.collections().trash?.postCount },
    ];
  }

  clickEvent(id: number | undefined) {
    if (!id) {
      return;
    }

    if (!this.isCheckable()) {
      this.router.navigateByUrl(`collection/${id}`);
    } else {
      this.selectedId.set(id);
      this.clickFolder.emit(this.selectedId());
    }
  }
}
