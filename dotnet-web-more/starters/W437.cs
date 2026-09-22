// W437: Hosted service lifecycle / Clock lifecycle duration 7 minutes
namespace DotnetWeb;
public static class W437{
public sealed class State{public DateTimeOffset? Started{get;set;}public DateTimeOffset? Stopped{get;set;}public List<string> Events{get;}=new();}
public static IHostedService Create(TimeProvider clock,State state){throw new NotImplementedException("W437");}
}
