// W558: Compile-time endpoint metadata reflection / Reflect handler audit tag audit-8
namespace DotnetWeb;
public static class W558{
[AttributeUsage(AttributeTargets.Method,AllowMultiple=true)]public sealed class AuditAttribute(string tag):Attribute{public string Tag{get;}=tag;}public static class Handlers{[Audit("audit-8")][Audit("common")]public static IResult Tagged()=>Results.Ok();public static IResult Plain()=>Results.Ok();[Audit("alternate")]public static IResult Other()=>Results.Ok();}
public static string[] Tags(System.Reflection.MethodInfo method){throw new NotImplementedException("W558");}
}
