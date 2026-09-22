using static DotnetWeb.W311;
namespace DotnetWeb;
public static class TestsW311{public static async Task Run(){await Task.CompletedTask;
{
var calls=0;var expected=new object();EndpointFilterDelegate next=_=>{calls++;return ValueTask.FromResult<object?>(expected);};var args=new object?[]{1,1};args[0]=1;var actual=await Invoke(new FilterContext(Check.Context(),args),next);Check.True(ReferenceEquals(expected,actual));Check.Equal(1,calls);
}
{
var calls=0;EndpointFilterDelegate next=_=>{calls++;return ValueTask.FromResult<object?>(null);};foreach(var bad in new object?[]{0,2,"1",null}){var args=new object?[]{1,1};args[0]=bad;Check.Status(400,(IResult)(await Invoke(new FilterContext(Check.Context(),args),next))!);}Check.Status(400,(IResult)(await Invoke(new FilterContext(Check.Context()),next))!);Check.Equal(0,calls);
}
}}
