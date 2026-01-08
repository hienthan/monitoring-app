import React from "react";
import { Navigate, useParams } from "react-router-dom";

export const RedirectServerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/dashboard/servers/${id}`} replace />;
};
