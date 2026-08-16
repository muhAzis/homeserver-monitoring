"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Icon from "../Icon";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const AccountManager = () => {
  const { data: session, status } = useSession();
  console.log({ session });
  
  return (
    <div className="flex gap-2 items-center">
      <div className="relative grid w-10 h-10 text-light-1 text-2xl font-bold bg-primary-500 rounded-xl place-items-center">
        <div className="absolute -bottom-1 -right-1 w-4 aspect-square bg-teal-500 border-2 border-white rounded-full"/>
        #
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <h1 className="text-xl font-semibold truncate">{session?.user?.name}</h1>
        <p className="text-xs text-dark-400 truncate">{session?.user?.email}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Icon icon="LuChevronDown" className="text-dark-400" size={24} onClick={() => {}}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-white" align="end">
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <hr className="border-dark-100" />
          <Button variant="ghost" className="text-red-500 w-full justify-start" onClick={() => signOut()}>
            Logout
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AccountManager;