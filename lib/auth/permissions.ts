/**
 * Centralised Hybrid RBAC + ABAC permission engine.
 *
 * Provides declarative access control rules for catalogue resources
 * (songs, albums, artists, playlists) based on user roles and resource attributes.
 *
 * @author Maruf Bepary
 */

import { ADMIN_USER_IDS } from "@/config/env";

export type Role = "admin" | "user";

export type AuthSubject = { id: string } | null | undefined;

export interface SongPermissionData {
  uploaderId: string;
}

export interface AlbumPermissionData {
  uploaderId: string;
}

export interface ArtistPermissionData {
  uploaderId: string | null;
}

export interface PlaylistPermissionData {
  userId: string;
  isFavourites: boolean;
}

export interface PermissionSchema {
  songs: {
    action: "view" | "create" | "delete";
    dataType: SongPermissionData;
  };
  albums: {
    action: "view" | "create" | "update" | "delete";
    dataType: AlbumPermissionData;
  };
  artists: {
    action: "view" | "create" | "update" | "delete";
    dataType: ArtistPermissionData;
  };
  playlists: {
    action: "view" | "create" | "update" | "rename" | "delete";
    dataType: PlaylistPermissionData;
  };
}

export type PermissionRule<TData> = boolean | ((user: { id: string }, data: TData) => boolean);

export type RolePermissions = {
  [K in keyof PermissionSchema]: {
    [A in PermissionSchema[K]["action"]]: PermissionRule<PermissionSchema[K]["dataType"]>;
  };
};

/**
 * Declarative permission matrix mapping roles to actions and attribute-based rules.
 */
export const ROLES: Record<Role, RolePermissions> = {
  admin: {
    songs: {
      view: true,
      create: true,
      delete: true,
    },
    albums: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    artists: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    playlists: {
      view: (user, playlist) => !playlist.isFavourites || playlist.userId === user.id,
      create: true,
      update: (user, playlist) => !playlist.isFavourites || playlist.userId === user.id,
      rename: (_user, playlist) => !playlist.isFavourites,
      delete: (_user, playlist) => !playlist.isFavourites,
    },
  },
  user: {
    songs: {
      view: true,
      create: true,
      delete: (user, song) => song.uploaderId === user.id,
    },
    albums: {
      view: true,
      create: true,
      update: (user, album) => album.uploaderId === user.id,
      delete: (user, album) => album.uploaderId === user.id,
    },
    artists: {
      view: true,
      create: true,
      update: (user, artist) => artist.uploaderId !== null && artist.uploaderId === user.id,
      delete: (user, artist) => artist.uploaderId !== null && artist.uploaderId === user.id,
    },
    playlists: {
      view: (user, playlist) => playlist.userId === user.id,
      create: true,
      update: (user, playlist) => playlist.userId === user.id,
      rename: (user, playlist) => !playlist.isFavourites && playlist.userId === user.id,
      delete: (user, playlist) => !playlist.isFavourites && playlist.userId === user.id,
    },
  },
};

/**
 * Checks if the given auth subject is a configured global admin.
 */
export function isAdmin(user: AuthSubject): boolean {
  if (!user?.id) {
    return false;
  }
  return ADMIN_USER_IDS.has(user.id);
}

/**
 * Resolves the role hierarchy for a subject.
 */
export function getUserRoles(user: AuthSubject): Role[] {
  if (!user?.id) {
    return [];
  }
  return isAdmin(user) ? ["admin", "user"] : ["user"];
}

/**
 * Evaluates whether an auth subject has permission to perform an action on a resource.
 */
export function hasPermission<Resource extends keyof PermissionSchema>(
  user: AuthSubject,
  resource: Resource,
  action: PermissionSchema[Resource]["action"],
  data?: PermissionSchema[Resource]["dataType"],
): boolean {
  if (!user?.id) {
    return action === "view" && resource !== "playlists";
  }

  const roles = getUserRoles(user);
  const authUser = { id: user.id };

  for (const role of roles) {
    const roleConfig = ROLES[role];
    const resourceConfig = roleConfig[resource];
    const rule = (resourceConfig as Record<string, PermissionRule<unknown>>)[action];

    if (typeof rule === "boolean") {
      if (rule) {
        return true;
      }
    } else if (typeof rule === "function") {
      if (data && rule(authUser, data)) {
        return true;
      }
    }
  }

  return false;
}
