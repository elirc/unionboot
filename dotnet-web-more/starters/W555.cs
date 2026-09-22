// W555: Compile-time endpoint metadata reflection / Reflect handler audit tag audit-5
namespace DotnetWeb;
public static class W555{
[AttributeUsage(AttributeTargets.Method,AllowMultiple=true)]public sealed class AuditAttribute(string tag):Attribute{public string Tag{get;}=tag;}public static class Handlers{[Audit("audit-5")][Audit("common")]public static IResult Tagged()=>Results.Ok();public static IResult Plain()=>Results.Ok();[Audit("alternate")]public static IResult Other()=>Results.Ok();}
public static string[] Tags(System.Reflection.MethodInfo method){throw new NotImplementedException("W555");}
}
