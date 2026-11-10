import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { WorkRecord, AuditRecord } from "@/lib/accountability/model";
const columns = "id,case_id,user_id,kind,title,status,data,created_at,updated_at";
export function useWorkRecords(caseId?: string) {
  const { user } = useAuth(); const client = useQueryClient();
  const query = useQuery({ queryKey:["case-work",caseId,user?.id],enabled:!!caseId&&!!user,queryFn:async()=>{
    if (!caseId || !user) return [];
    const {data,error}=await supabase.from("case_work_records").select(columns).eq("case_id",caseId).eq("user_id",user.id).order("created_at");
    if(error) throw error; return (data??[]) as unknown as WorkRecord[];
  }});
  const audit = useQuery({queryKey:["case-work-audit",caseId,user?.id],enabled:!!caseId&&!!user,queryFn:async()=>{
    if(!caseId||!user)return [];
    const {data,error}=await supabase.from("case_work_audit").select("id,record_id,kind,action,created_at,before_record,after_record").eq("case_id",caseId).eq("user_id",user.id).order("created_at",{ascending:false}).limit(100);
    if(error)throw error; return (data??[]) as unknown as AuditRecord[];
  }});
  const save = useMutation({mutationFn:async(record: Pick<WorkRecord,"kind"|"title"|"status"|"data"> & {id?:string})=>{
    if(!caseId||!user)throw new Error("Sign in and select an owned case.");
    const payload={title:record.title.trim(),status:record.status,data:record.data};
    const request=record.id ? supabase.from("case_work_records").update(payload).eq("id",record.id).eq("case_id",caseId).eq("user_id",user.id) : supabase.from("case_work_records").insert({...payload,kind:record.kind,case_id:caseId,user_id:user.id});
    const {data,error}=await request.select(columns).single(); if(error)throw error; return data as unknown as WorkRecord;
  },onSuccess:()=>{void client.invalidateQueries({queryKey:["case-work"]});void client.invalidateQueries({queryKey:["case-work-audit"]});}});
  return {records:query.data??[],audit:audit.data??[],isLoading:query.isLoading,error:query.error??audit.error,save};
}
