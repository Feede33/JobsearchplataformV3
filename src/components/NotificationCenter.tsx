import React, { useState } from 'react';
import { Bell, Check, Trash, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useNotifications } from '@/lib/useSupabaseData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();
  
  const [open, setOpen] = useState(false);

  // Función para formatear la fecha relativa en español
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  // Función para obtener icono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return <span className="text-blue-500 text-lg">💼</span>;
      case 'application_status':
        return <span className="text-green-500 text-lg">📝</span>;
      case 'new_job':
        return <span className="text-purple-500 text-lg">✨</span>;
      default:
        return <span className="text-gray-500 text-lg">📌</span>;
    }
  };

  // Manejar clic en una notificación
  const handleNotificationClick = async (notification: any) => {
    // Si no está leída, marcarla como leída
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Aquí se puede añadir navegación según el tipo y datos de la notificación
    // Por ejemplo: navigate(`/jobs/${notification.data.job_id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Notificaciones</CardTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => markAllAsRead()}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
          <CardDescription>
            {loading ? 'Cargando...' : 
              notifications.length === 0 
                ? 'No tienes notificaciones' 
                : `Tienes ${notifications.length} notificaciones`
            }
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div key={notification.id}>
                  <div 
                    className={cn(
                      "p-3 cursor-pointer hover:bg-muted/50 transition-colors",
                      !notification.is_read && "bg-muted/30"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            {!notification.is_read && (
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
              <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">No tienes notificaciones</p>
            </div>
          )}
        </ScrollArea>
        <CardFooter className="p-2 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setOpen(false)}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Cerrar
          </Button>
        </CardFooter>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter; 