// W551: Compile-time endpoint metadata reflection / Reflect handler audit tag audit-1
namespace DotnetWeb;
public static class W551{
[AttributeUsage(AttributeTargets.Method,AllowMultiple=true)]public sealed class AuditAttribute(string tag):Attribute{public string Tag{get;}=tag;}public static class Handlers{[Audit("audit-1")][Audit("common")]public static IResult Tagged()=>Results.Ok();public static IResult Plain()=>Results.Ok();[Audit("alternate")]public static IResult Other()=>Results.Ok();}
public static string[] Tags(System.Reflection.MethodInfo method){
return method.GetCustomAttributes(typeof(AuditAttribute),false).Cast<AuditAttribute>().Select(x=>x.Tag).ToArray();
}
}
