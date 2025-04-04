import { NgClass } from '@angular/common';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CollectionApi, CollectionType } from 'src/entities/collection';
import { IconComponent } from 'src/shared/components';

@Component({
  selector: 'app-system-folders',
  templateUrl: './system-folders.component.html',
  imports: [IconComponent, NgClass],
})
export class SystemFoldersComponent {
  private readonly router = inject(Router);
  private readonly collectionApi = inject(CollectionApi);

  isCheckable = input<boolean>(false);
  inputRef = viewChild<HTMLInputElement>('inputRef');
  selectedId = signal<number | undefined>(undefined);
  clickFolder = output<number | undefined>();
  collectionList: CollectionType[] = [];

  constructor() {
    this.collectionApi.getCollections().subscribe((res) => {
      this.collectionList = res;
    });
  }

  get systemFolders() {
    return [
      { id: this.collections.uncategorized?.id, label: '미분류', name: 'uncategorized', postCount: this.collections.uncategorized?.postCount },
      { id: this.collections.trash?.id, label: '휴지통', name: 'trash', postCount: this.collections.trash?.postCount },
    ];
  }

  get collections() {
    return {
      uncategorized: this.collectionList?.find((collection) => collection.type === 'UNCATEGORIZED'),
      trash: this.collectionList?.find((collection) => collection.type === 'TRASH'),
    };
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
