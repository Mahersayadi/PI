import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule],
  template: `
    <div class="chatbot-container">
      <div class="chat-window" *ngIf="isOpen">
        <div class="chat-header">
          <span>Assistant RH (IA)</span>
          <button mat-icon-button (click)="toggleChat()"><mat-icon>close</mat-icon></button>
        </div>
        
        <div class="chat-messages">
          <div *ngFor="let msg of messages" class="message" [ngClass]="msg.role">
            {{ msg.text }}
          </div>
          <div *ngIf="isLoading" class="message bot loading">
            En train d'écrire...
          </div>
        </div>
        
        <div class="chat-input">
          <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Posez une question..." />
          <button mat-icon-button color="primary" (click)="sendMessage()" [disabled]="!newMessage.trim() || isLoading">
            <mat-icon>send</mat-icon>
          </button>
        </div>
      </div>
      
      <button class="fab" mat-fab color="primary" (click)="toggleChat()" *ngIf="!isOpen">
        <mat-icon>chat</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
    .fab { display: flex; align-items: center; justify-content: center; }
    .chat-window { width: 350px; height: 500px; background: white; border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.2); overflow: hidden; }
    .chat-header { background: #3f51b5; color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
    .chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; }
    .message { max-width: 80%; padding: 10px; border-radius: 8px; font-size: 14px; line-height: 1.4; word-wrap: break-word; }
    .user { background: #3f51b5; color: white; align-self: flex-end; border-bottom-right-radius: 0; }
    .bot { background: #e0e0e0; color: black; align-self: flex-start; border-bottom-left-radius: 0; }
    .loading { font-style: italic; color: #666; background: transparent; }
    .chat-input { display: flex; padding: 10px; background: white; border-top: 1px solid #ddd; }
    .chat-input input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 20px; outline: none; padding-left: 15px; }
  `]
})
export class ChatbotComponent {
  isOpen = false;
  messages: { role: 'user' | 'bot', text: string }[] = [
    { role: 'bot', text: 'Bonjour ! Je suis votre assistant RH virtuel. Comment puis-je vous aider aujourd\'hui ?' }
  ];
  newMessage = '';
  isLoading = false;

  constructor(private aiService: AiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMsg = this.newMessage;
    this.messages.push({ role: 'user', text: userMsg });
    this.newMessage = '';
    this.isLoading = true;

    this.aiService.chat(userMsg).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.messages.push({ role: 'bot', text: res.reply || 'Désolé, je n\'ai pas compris.' });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Chat error', err);
        this.messages.push({ role: 'bot', text: 'Oups, il y a eu une erreur de connexion avec mon serveur.' });
      }
    });
  }
}
