// W444: Captured ILogger assertions / Structured Debug event 103
namespace DotnetWeb;
public static class W444{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Debug,new EventId(103,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
