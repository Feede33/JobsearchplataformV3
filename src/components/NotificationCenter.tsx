import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash, X, Filter, Eye, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useNotifications } from '@/lib/useSupabaseData';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos de notificaciones disponibles
const NOTIFICATION_TYPES = {
  ALL: 'all',
  JOB_MATCH: 'job_match',
  APPLICATION_STATUS: 'application_status',
  NEW_JOB: 'new_job',
  SYSTEM: 'system'
};

// Componente para mostrar una notificación individual
const NotificationItem = ({ 
  notification, 
  onDelete, 
  onRead, 
  onClick 
}) => {
  // Función para obtener icono según el tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.JOB_MATCH:
        return <span className="text-blue-500 text-lg">💼</span>;
      case NOTIFICATION_TYPES.APPLICATION_STATUS:
        return <span className="text-green-500 text-lg">📝</span>;
      case NOTIFICATION_TYPES.NEW_JOB:
        return <span className="text-purple-500 text-lg">✨</span>;
      case NOTIFICATION_TYPES.SYSTEM:
        return <span className="text-orange-500 text-lg">🔔</span>;
      default:
        return <span className="text-gray-500 text-lg">📌</span>;
    }
  };

  // Función para formatear la fecha relativa en español
  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      return 'Fecha desconocida';
    }
  };

  // Determinar si hay acciones disponibles según el tipo
  const hasActions = notification.data && 
    (notification.type === NOTIFICATION_TYPES.JOB_MATCH || 
     notification.type === NOTIFICATION_TYPES.APPLICATION_STATUS ||
     notification.type === NOTIFICATION_TYPES.NEW_JOB);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-4 cursor-pointer hover:bg-muted/50 transition-colors border-l-4",
        !notification.is_read && "bg-muted/30 border-l-blue-500",
        notification.is_read && "border-l-transparent"
      )}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className={cn(
              "font-medium text-sm",
              !notification.is_read && "font-semibold"
            )}>
              {notification.title}
            </p>
            <div className="flex items-center gap-1">
              {!notification.is_read && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-blue-100 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead(notification.id);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:bg-red-100 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash className="h-3.5 w-3.5" />
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
          
          {/* Acciones contextuales según el tipo de notificación */}
          {hasActions && (
            <div className="mt-2 flex gap-2">
              {notification.type === NOTIFICATION_TYPES.JOB_MATCH && notification.data?.jobId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/job/${notification.data.jobId}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver empleo
                </Button>
              )}
              
              {notification.type === NOTIFICATION_TYPES.APPLICATION_STATUS && notification.data?.applicationId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/profile?tab=applications`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver aplicación
                </Button>
              )}
              
              {notification.type === NOTIFICATION_TYPES.NEW_JOB && notification.data?.jobId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/job/${notification.data.jobId}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ver nuevo empleo
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationCenter = ({ isFullPage = false }) => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  } = useNotifications();
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(NOTIFICATION_TYPES.ALL);
  const navigate = useNavigate();

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter(notification => 
    activeTab === NOTIFICATION_TYPES.ALL || notification.type === activeTab
  );

  // Contar notificaciones por tipo
  const notificationCounts = notifications.reduce((acc, notification) => {
    const type = notification.type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Refrescar notificaciones periódicamente cuando el popover está abierto
  useEffect(() => {
    let interval;
    if (open) {
      interval = setInterval(() => {
        fetchNotifications();
      }, 30000); // Cada 30 segundos
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [open, fetchNotifications]);

  // Manejar clic en una notificación
  const handleNotificationClick = async (notification) => {
    // Si no está leída, marcarla como leída
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Navegar según el tipo y datos de la notificación
    if (notification.data) {
      if (notification.type === NOTIFICATION_TYPES.JOB_MATCH && notification.data.jobId) {
        navigate(`/job/${notification.data.jobId}`);
      } else if (notification.type === NOTIFICATION_TYPES.APPLICATION_STATUS && notification.data.applicationId) {
        navigate(`/profile?tab=applications`);
      } else if (notification.type === NOTIFICATION_TYPES.NEW_JOB && notification.data.jobId) {
        navigate(`/job/${notification.data.jobId}`);
      }
    }
    
    // Si no es página completa, cerrar el popover
    if (!isFullPage) {
      setOpen(false);
    }
  };

  // Renderizar el contenido de las notificaciones
  const renderNotificationsContent = () => (
    <>
      <div className="pb-2 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value={NOTIFICATION_TYPES.ALL} className="flex-1">
              Todas
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={NOTIFICATION_TYPES.JOB_MATCH} className="flex-1">
              Matches
              {notificationCounts[NOTIFICATION_TYPES.JOB_MATCH] > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notificationCounts[NOTIFICATION_TYPES.JOB_MATCH]}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value={NOTIFICATION_TYPES.APPLICATION_STATUS} className="flex-1">
              Aplicaciones
              {notificationCounts[NOTIFICATION_TYPES.APPLICATION_STATUS] > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notificationCounts[NOTIFICATION_TYPES.APPLICATION_STATUS]}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className={isFullPage ? "h-[calc(100vh-200px)]" : "h-[300px]"}>
        {loading ? (
          <div className="flex justify-center items-center h-[100px] p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <NotificationItem
                  notification={notification}
                  onDelete={deleteNotification}
                  onRead={markAsRead}
                  onClick={handleNotificationClick}
                />
                <Separator />
              </React.Fragment>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
            <Bell className="h-10 w-10 text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">
              {activeTab === NOTIFICATION_TYPES.ALL 
                ? 'No tienes notificaciones' 
                : `No tienes notificaciones de tipo ${activeTab}`}
            </p>
          </div>
        )}
      </ScrollArea>
    </>
  );

  // Si es página completa, renderizar como página
  if (isFullPage) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center">
              <Bell className="mr-2 h-6 w-6" /> 
              Centro de Notificaciones
            </CardTitle>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => markAllAsRead()}
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
          <CardDescription>
            {loading ? 'Cargando notificaciones...' : 
              notifications.length === 0 
                ? 'No tienes notificaciones' 
                : `Tienes ${notifications.length} notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderNotificationsContent()}
        </CardContent>
      </Card>
    );
  }

  // Renderizar como popover
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
      <PopoverContent className="w-[350px] p-0" align="end">
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
                : `Tienes ${notifications.length} notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`
            }
          </CardDescription>
        </CardHeader>
        
        {renderNotificationsContent()}
        
        <CardFooter className="p-2 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => {
              setOpen(false);
              navigate('/notifications');
            }}
          >
            Ver todas
          </Button>
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