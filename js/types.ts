declare global {
  interface Window {
    __initialSearchParam: string;
    __initialFilterParam: string;
  }
}

export interface Thread {
  objectID: string;
  title: string;
}

export interface Comment {
  id: number | string;
  text?: string;
  comment_text?: string;
  author: string;
  created_at: string;
  created_at_i: number;
  parent_id: number | string;
  story_id?: number | string;
  story_title?: string;
  type?: string;
}

export interface DomElements {
  searchInput: HTMLInputElement | null;
  clearSearchBtn: HTMLButtonElement | null;
  controlButtonsContainer: HTMLElement | null;
  jobsContainer: HTMLElement | null;
  themeToggle: HTMLButtonElement | null;
  goToTopButton: HTMLButtonElement | null;
  helpModal: HTMLElement | null;
  openHelpModalBtn: HTMLButtonElement | null;
  closeHelpModalBtn: HTMLButtonElement | null;
  toastElement: HTMLElement | null;
}

export interface LoadThreadOptions {
  preserveVisibleContent?: boolean;
}
