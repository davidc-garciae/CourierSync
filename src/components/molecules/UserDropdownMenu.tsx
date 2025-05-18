"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/basic/dropdown-menu";
import { LogoutIcon } from "../ui/logout";
import { ChevronUpIcon } from "../ui/chevron-up";

interface UserDropdownMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onLogout: () => void;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user,
  onLogout,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="flex items-center w-full gap-2 p-2 transition-colors border rounded-lg shadow bg-background/80 hover:bg-primary/10 border-border"
        aria-label="Menú de usuario"
      >
        <Avatar className="w-10 h-10 rounded-full grayscale">
          <AvatarImage
            src={user.avatar}
            alt={user.name}
            className="object-cover w-10 h-10"
            style={{
              objectPosition: "center",
              transform: "scale(1.5)",
              imageRendering: "auto",
            }}
          />
          <AvatarFallback className="rounded-full">
            {user.name?.[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-sm leading-tight text-left">
          <span className="font-medium truncate">{user.name}</span>
          <span className="text-xs truncate text-muted-foreground">
            {user.email}
          </span>
        </div>
        <ChevronUpIcon className="flex items-center justify-center w-6 h-6" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="object-cover w-10 h-10"
              style={{
                objectPosition: "center",
                transform: "scale(1.5)",
                imageRendering: "auto",
              }}
            />
            <AvatarFallback className="rounded-full">
              {user.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-sm leading-tight text-left">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-xs truncate text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
        <LogoutIcon className="flex items-center justify-center w-6 h-6" />
        Cerrar sesión
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
