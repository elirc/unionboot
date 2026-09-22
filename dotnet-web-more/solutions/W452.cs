// W452: Options post-configure validation / Normalize then validate multiplier 3
namespace DotnetWeb;
public static class W452{
public sealed class Settings{public int Limit{get;set;}}
public static ServiceProvider Configure(int initial){
var services=new ServiceCollection();services.AddOptions<Settings>().Configure(o=>o.Limit=initial).PostConfigure(o=>{if(o.Limit==0)o.Limit=1;o.Limit*=3;}).Validate(o=>o.Limit>0&&o.Limit<=30,"limit outside range");return services.BuildServiceProvider();
}
}
