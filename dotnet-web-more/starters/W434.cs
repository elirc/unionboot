// W434: Hosted service lifecycle / Clock lifecycle duration 4 minutes
namespace DotnetWeb;
public static class W434{
public sealed class State{public DateTimeOffset? Started{get;set;}public DateTimeOffset? Stopped{get;set;}public List<string> Events{get;}=new();}
public static IHostedService Create(TimeProvider clock,State state){throw new NotImplementedException("W434");}
}
